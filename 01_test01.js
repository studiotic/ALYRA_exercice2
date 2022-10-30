
const Voting = artifacts.require("./contracts/Voting.sol");

const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');




contract("Voting", accounts => {


  //on défini les constantes
  const _owner  = accounts[0];
  const _voter1 = accounts[1];
  const _voter2 = accounts[2];
  const _voter3 = accounts[3];

  const _proposal1 = "first proposal";
  const _proposal2 = "second proposal";
  const _proposal3 = "third proposal";
 
  const voteFromVoter1  = new BN(1) ;
  const voteFromVoter2  = new BN(2) ;
  const voteFromVoter3  = new BN(3) ;

  const numeroVoter1    = new BN(1) ;
  const numeroVoter2    = new BN(2) ;
  const numeroVoter3    = new BN(3) ;


  //defini la variable votingInstance
  let votingInstance;

describe("general", function (){

      beforeEach(async function () {
        votingInstance = await Voting.new({from:_owner});
        console.log("BE general");
      });



      describe("1-Test du ADD VOTER", function (){

        beforeEach(async function () {
          console.log("BE Test du ADD VOTER");
        });


        //test 1  test add voter du only owners 
        it("test1 : try to store new voter from not owner adress", async () => {
          await expectRevert(votingInstance.addVoter(_voter1,{from:_voter1}), "Ownable: caller is not the owner");
        });


        //test 2 verifie la bonne etape du vote
        it("test2 : try to store new voter from other voting phase", async () => {

          //the owner add 1 voter
          await votingInstance.addVoter(_voter1, { from: _owner });

          //next step start proposal registering
          await votingInstance.startProposalsRegistering( { from: _owner });

          //decide to addvoter back in procédure
          await expectRevert(votingInstance.addVoter(_voter1,{from:_owner}), "Voters registration is not open yet");

        });


        //test 3 verifie le double enregistrement du votant
        it("test3 : try to store 2 times the same voter", async () => {

          //the owner add 3 voters
          await votingInstance.addVoter(_voter1, { from: _owner });
          await votingInstance.addVoter(_voter2, { from: _owner });

          //decide to add voter already registred 
          await expectRevert(votingInstance.addVoter(_voter1,{from:_owner}), "Already registered");

        });


        //test 4 add voter from owner. test if registration of the new voter is ok

        it("test4 : it should store voter in array, getVoter isRegistred", async () => {

            await votingInstance.addVoter(_voter1, { from: _owner });

            const storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });

            expect(storedData.isRegistered).to.be.true;
        });


        //test 5 add voter from owner. test if registration of the new voter is ok and hasvoted is false

        it("test5 : it should store voter in array, getVoter hasVoted", async () => {

          await votingInstance.addVoter(_voter1, { from: _owner });

          const storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });

          expect(storedData.hasVoted).to.be.false;
        });


        //test 6 test event when add voter is done
        it("test6 : should emit event on ADD VOTER", async () => {
          const storedData = await votingInstance.addVoter(_voter1, { from: _owner }) ;
          expectEvent(storedData, "VoterRegistered" , {voterAddress: _voter1 });

        });


      }); //fin du describe  1


      describe("2-Test du ADD PROPOSAL", function (){

          beforeEach(async function () {
              //console.log("BE Test du ADD PROPOSAL ")  

              //add 3 voters and don't pass to the next step
              await votingInstance.addVoter(_voter1, { from: _owner });
              await votingInstance.addVoter(_voter2, { from: _owner });
              await votingInstance.addVoter(_voter3, { from: _owner });
          
          });

       
        //verifie la bonne etape en essayant d'ajouter une proposal sans etre dans la bonne phase
        it("test7 : try to store new proposal from the first voting phase (add voters)", async () => {

          const requireMessage = "Proposals are not allowed yet" ;
          //decide to add a proposal from the fisrt step of votin (add voter) it should activate the require
          await expectRevert(votingInstance.addProposal(_proposal2, { from: _voter2 })  , requireMessage);

        }); //fin du it

       
     
        //verifie la proposition vide
        it("test8 : try to store an empty proposal by owner", async () => {

          //next step : start register new proposal
          await votingInstance.startProposalsRegistering( { from: _owner });

          //decide to add a proposal from the fisrt step of votin (add voter) it should activate the require
          const requireMessage = "Vous ne pouvez pas ne rien proposer" ;
          await expectRevert(  votingInstance.addProposal( '' , { from: _voter1 }) , requireMessage);

        });//fin du it
     
     
        

          //test  test numero proposition 0 de vote est bien genesis
          it("test 9 : it should store a proposal 0 genesis in array, getOneProposal 0 has description Genesis", async () => {

                //next step
                await votingInstance.startProposalsRegistering( { from: _owner });

                const storedData = await votingInstance.getOneProposal(0, { from: _voter1 });
                expect(storedData.description).to.equal("GENESIS");

            });


    

            //test ajoute 3 propositions à la suite et controle leur libellé
            it("test 10 : it should store  proposal 1 from Voter 1 with description + control : " + _proposal1 , async () => {

              //next step
              await votingInstance.startProposalsRegistering( { from: _owner });

              //the voter1 add a proposal
              await votingInstance.addProposal(_proposal1, { from: _voter1 });

              const storedData = await votingInstance.getOneProposal(numeroVoter1, { from: _voter1 });
              expect(storedData.description).to.equal(_proposal1);

    
          }); 
          
         


          //test  event when add proposal is done
          it("test11 : should emit event on ADD PROPOSAL", async () => {

             //proposal step
             await votingInstance.startProposalsRegistering( { from: _owner });

            //add proposal
            const storedData1 = await votingInstance.addProposal(_proposal1, { from: _voter1 });
            const storedData2 = await votingInstance.addProposal(_proposal2, { from: _voter2 });

            expectEvent(storedData2, "ProposalRegistered" , {proposalId:new BN(numeroVoter2)});

          });

    

          
          //test  test numero proposition 0 de vote est bien genesis
          it("test 12 : only voter can rec some proposal", async () => {

            //next step
            await votingInstance.startProposalsRegistering( { from: _owner });

            
            //const storedData = await votingInstance.addProposal(_proposal1, { from: _owner });

            const messageRequire = "You're not a voter" ;

           await expectRevert( votingInstance.addProposal(_proposal1, { from: _owner }) , messageRequire);

        });



      
      }); //fin du describe 2
 

      describe("3-Test du SET  VOTE", function (){

        beforeEach(async function () {

            console.log("BE Test du ADD VOTE ")  

            //add 3 voters and don't pass to the next step
            await votingInstance.addVoter(_voter1, { from: _owner });
            await votingInstance.addVoter(_voter2, { from: _owner });
            await votingInstance.addVoter(_voter3, { from: _owner });

            //start proposal registering
            await votingInstance.startProposalsRegistering( { from: _owner });

            //add 3 proposals
            await votingInstance.addProposal(_proposal1, { from: _voter1 });
            await votingInstance.addProposal(_proposal2, { from: _voter2 });
            await votingInstance.addProposal(_proposal3, { from: _voter3 });

            //close proposal registering
            await votingInstance.endProposalsRegistering( { from: _owner });

        });

          

          //verifie la bonne etape en essayant d'ajouter une proposal sans etre dans la bonne phase
          it("test13 : try to vote from outside the voting phase", async () => {

            const requireMessage = "Voting session havent started yet" ;
            await expectRevert( votingInstance.setVote(voteFromVoter1, { from: _voter1 })  , requireMessage);
  
          }); //fin du it
          

    
        it("test 14 : only voters can vote", async () => {

          //start votin session
          await votingInstance.startVotingSession( { from: _owner });

          const requireMessage = "You're not a voter" ;

         await expectRevert( votingInstance.setVote(voteFromVoter1, { from: _owner }) , requireMessage);

        });
        



        it("test 15 : only one voter per voter", async () => {

          //start votin session
          await votingInstance.startVotingSession( { from: _owner });

          //first vote
          await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ; 

          //the same voter wants to vote again

          const requireMessage = "You have already voted" ;

          await expectRevert( votingInstance.setVote(voteFromVoter1, { from: _voter1 }), requireMessage);

        });


        
        it("test 16 : vote for an inexistant proposal", async () => {

          //start votin session
          await votingInstance.startVotingSession( { from: _owner });

          //the  voter votes for an unknow proposal 
          const requireMessage = "Proposal not found" ;

          await expectRevert( votingInstance.setVote(4, { from: _voter1 }), requireMessage);

        });

        //voici un test qui met en evidence un bug dans le programme
        
        //it("test 17 : vote for an inexistant proposal", async () => {

         // //start votin session
         // await votingInstance.startVotingSession( { from: _owner });

         // //the  voter votes for an unknow proposal 
         // const requireMessage = "Proposal not found" ;

         // await expectRevert( votingInstance.setVote(0, { from: _voter1 }), requireMessage);

        //});
       
        
        it("Test 18 : is Hasvoted true after a vote", async () => {
          //start votin session
          await votingInstance.startVotingSession( { from: _owner });

          await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;

          storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
          expect(storedData.hasVoted).to.be.true;


        });
        
        it("Test 19 : the storage value of the vote equal what he votes", async () => {
          //start votin session
          await votingInstance.startVotingSession( { from: _owner });

          await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;

          storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
          expect(storedData.votedProposalId).to.be.bignumber.equal(new BN(voteFromVoter1));
          
          
        });

        
        it("Test 20 : the storage value of the vote equal what he votes", async () => {
          //start votin session
          await votingInstance.startVotingSession( { from: _owner });
          //3 same votes
          await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;
          await votingInstance.setVote(voteFromVoter1, { from: _voter2 }) ;
          await votingInstance.setVote(voteFromVoter1, { from: _voter3 }) ;

          
          storedData = await votingInstance.getOneProposal(voteFromVoter1, { from: _voter1 });
          expect(storedData.voteCount).to.be.bignumber.equal(new BN(3));
        });




        // A tester seb  21   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

       
         //test  event when vote is done
          it("test21 : should emit event on vote", async () => {

            //start votin session
           await votingInstance.startVotingSession( { from: _owner });

            //3 same votes
            const storedData = await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;

            expectEvent(storedData, "Voted" , { voter:_voter1 , proposalId: new BN(voteFromVoter1) });

          });


          
    


        }); //fin du describe 3

   







        describe("4-Test du startProposalsRegistering", function (){

          beforeEach(async function () {
              //console.log("BE du START REC PROPOSAL ")  
          });
  
        
         
            it("test22 : try to start proposal registrering from voter adress", async () => {
  
              //the  voter votes for an unknow proposal 
              const requireMessage = "Ownable: caller is not the owner" ;
              await expectRevert(votingInstance.startProposalsRegistering( { from: _voter1 }), requireMessage);
            }); //fin du it
            


            
           it("test 23 : try to call this function from other pahse of the vote", async () => {

            await votingInstance.startProposalsRegistering( { from: _owner });   
            await votingInstance.endProposalsRegistering( { from: _owner });   

            //the  voter votes for an unknow proposal 
            const requireMessage = "Registering proposals cant be started now" ;
            await expectRevert(votingInstance.startProposalsRegistering( { from: _owner }), requireMessage);

            });


            it("test 24 : does the genesis created ..", async () => {

              //the owner add 3 voters
              await votingInstance.addVoter(_voter1, { from: _owner });
              
              //next step
              await votingInstance.startProposalsRegistering( { from: _owner });

              const storedData = await votingInstance.getOneProposal(0, { from: _voter1 });
              expect(storedData.description).to.equal("GENESIS");

              });
  

              //test  event when vote is done
              it("test 25 : should emit event on start Proposals Registering", async () => {

                const storedData = await votingInstance.startProposalsRegistering( { from: _owner });
                expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(0), newStatus:new BN(1)});

              });


          }); //fin du describe 4









  describe("5-Test du endProposalsRegistering", function (){

    beforeEach(async function () {
        //console.log("BE du START REC PROPOSAL ")  
    });


 
    it("test 26 : try to end Proposals Registering from voter adress", async () => {


      await votingInstance.startProposalsRegistering( { from: _owner });

      //the  voter votes for an unknow proposal 
      const requireMessage = "Ownable: caller is not the owner" ;
      await expectRevert(votingInstance.endProposalsRegistering( { from: _voter1 }), requireMessage);
    }); //fin du it
    


    
      it("test 27 : try to call this function from other phase of the vote", async () => {

        //the  voter votes for an unknow proposal 
        const requireMessage = "Registering proposals havent started yet" ;
        await expectRevert(votingInstance.endProposalsRegistering( { from: _owner }), requireMessage);

        });



      //test  event when vote is done
      it("test 28 : should emit event on End Proposals Registering", async () => {

        await votingInstance.startProposalsRegistering( { from: _owner });

        const storedData = await votingInstance.endProposalsRegistering( { from: _owner });

        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(1), newStatus:new BN(2)});

      });


  }); //fin du describe 5



 


describe("6-Test du startVotingSession", function (){

  beforeEach(async function () {
      //console.log("BE du START REC PROPOSAL ")  
  });


 
    it("test 29 : try to start Voting Session from voter adress", async () => {


      await votingInstance.startProposalsRegistering( { from: _owner });
      await votingInstance.endProposalsRegistering( { from: _owner });

      //the  voter votes for an unknow proposal 
      const requireMessage = "Ownable: caller is not the owner" ;
      await expectRevert(votingInstance.startVotingSession( { from: _voter1 }), requireMessage);
    }); //fin du it
    


    
      it("test 30 : try to call this function from other phase of the vote", async () => {

        //the  voter votes for an unknow proposal 
        const requireMessage = "Registering proposals phase is not finished" ;
        await expectRevert(votingInstance.startVotingSession( { from: _owner }), requireMessage);

        });



      //test  event when vote is done
      it("test 31 : should emit event on start Voting Session", async () => {

        
      await votingInstance.startProposalsRegistering( { from: _owner });
      await votingInstance.endProposalsRegistering( { from: _owner });

        const storedData = await votingInstance.startVotingSession( { from: _owner });

        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(2), newStatus:new BN(3)});

      });


  }); //fin du describe 6





  describe("7-Test du endVotingSession", function (){

      beforeEach(async function () {
      });

 
    it("test 32 : try to end Voting Session from voter's adress", async () => {


      await votingInstance.startProposalsRegistering( { from: _owner });
      await votingInstance.endProposalsRegistering( { from: _owner });
      await votingInstance.startVotingSession( { from: _owner });

      //the  voter votes for an unknow proposal 
      const requireMessage = "Ownable: caller is not the owner" ;
      await expectRevert(votingInstance.endVotingSession( { from: _voter1 }), requireMessage);
    }); //fin du it
    


    
      it("test 33 : try to call this function from other phase of the vote", async () => {

        //the  voter votes for an unknow proposal 
        const requireMessage = "Voting session havent started yet" ;
        await expectRevert(votingInstance.endVotingSession( { from: _owner }), requireMessage);

        });



      //test  event when Workflow Status change
      it("test 34 : should emit event on start Voting Session", async () => {

        
        await votingInstance.startProposalsRegistering( { from: _owner });
        await votingInstance.endProposalsRegistering( { from: _owner });
        await votingInstance.startVotingSession( { from: _owner });

        const storedData = await votingInstance.endVotingSession( { from: _owner });

        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(3), newStatus:new BN(4)});

      });


  }); //fin du describe 7



describe("8-Test of tallyVotes", function (){

  beforeEach(async function () {

         //add 3 voters and don't pass to the next step
         await votingInstance.addVoter(_voter1, { from: _owner });
         await votingInstance.addVoter(_voter2, { from: _owner });
         await votingInstance.addVoter(_voter3, { from: _owner });

        await votingInstance.startProposalsRegistering( { from: _owner });

        await votingInstance.addProposal(_proposal1, { from: _voter1 });
        await votingInstance.addProposal(_proposal2, { from: _voter2 });
        await votingInstance.addProposal(_proposal3, { from: _voter3 });
  
        await votingInstance.endProposalsRegistering( { from: _owner });

        await votingInstance.startVotingSession( { from: _owner });

  });

 
    it("test 35 : try to call tallyVotes from voter's adress", async () => {

      //the  voter votes for an unknow proposal 
      const requireMessage = "Ownable: caller is not the owner" ;
      await expectRevert(votingInstance.tallyVotes( { from: _voter1 }), requireMessage);
    }); //fin du it
    


    
      it("test 36 : try to call this function from other phase of the vote", async () => {

        //the  voter votes for an unknow proposal 
        const requireMessage = "Current status is not voting session ended" ;
        await expectRevert(votingInstance.tallyVotes( { from: _owner }), requireMessage);

        });



      //test  event when Workflow Status change
      it("test 37 : should emit event on tallyVotes", async () => {

        await votingInstance.endVotingSession( { from: _owner });

        const storedData = await votingInstance.tallyVotes( { from: _owner });
        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(4), newStatus:new BN(5)});

      });


  }); //fin du describe 8



/*

 await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;
      await votingInstance.setVote(voteFromVoter1, { from: _voter2 }) ;
      await votingInstance.setVote(voteFromVoter1, { from: _voter3 }) ;



   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       uint _winningProposalId;
      for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}
*/



    }); //fin du describe general

  }); //fin du contrat


