
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

  const numeroProposal1    = new BN(1) ;
  const numeroProposal2    = new BN(2) ;
  const numeroProposal3    = new BN(3) ;

  //defini la variable votingInstance
  let votingInstance;


  describe("general", function (){

    beforeEach(async function () {
      votingInstance = await Voting.new({from:_owner});
    });

    describe("1 - addvoter tests", function (){

        beforeEach(async function () {
        });

        it("test 1 : try to store new voter from toher adress than the owner", async () => {
          await expectRevert(votingInstance.addVoter(_voter1,{from:_voter1}), "Ownable: caller is not the owner");
        });

        it("test 2 : try to store new voter from other voting phase", async () => {
          //the owner add 1 voter
          await votingInstance.addVoter(_voter1, { from: _owner });

          //next step start proposal registering
          await votingInstance.startProposalsRegistering( { from: _owner });

          //decide to add a voter back in procédure
          await expectRevert(votingInstance.addVoter(_voter1,{from:_owner}), "Voters registration is not open yet");
        });

        it("test 3 : try to store 2 times the same voter", async () => {
          //the owner add 2 voters
          await votingInstance.addVoter(_voter1, { from: _owner });
          await votingInstance.addVoter(_voter2, { from: _owner });

          //try to add voter already registred 
          await expectRevert(votingInstance.addVoter(_voter1,{from:_owner}), "Already registered");
        });

        it("test 4 : add a voter, the isregistred flag is true.", async () => {
            //the owner add 1 voter
            await votingInstance.addVoter(_voter1, { from: _owner });

            const storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
            expect(storedData.isRegistered).to.be.true;
        });

        it("test 5 : add a voter, the hasVoted flag is false", async () => {
          //the owner add 1 voter
          await votingInstance.addVoter(_voter1, { from: _owner });

          const storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
          expect(storedData.hasVoted).to.be.false;
        });

        it("test 6 : should emit event on addVoter", async () => {
          //the owner add 1 voter
          const storedData = await votingInstance.addVoter(_voter1, { from: _owner }) ;
          //test event
          expectEvent(storedData, "VoterRegistered" , {voterAddress: _voter1 });
        });

    });

    describe("2 - addProposal tests", function (){

      beforeEach(async function () { 
          //add 3 voters but don't close the addvoter session
          await votingInstance.addVoter(_voter1, { from: _owner });
          await votingInstance.addVoter(_voter2, { from: _owner });
          await votingInstance.addVoter(_voter3, { from: _owner });
      });

      it("test 7 : should revert if you try to store new proposal from the add voters phase.", async () => {
        const requireMessage = "Proposals are not allowed yet" ;
        //decide to add a new proposal from the add voters phase. it should revert
        await expectRevert(votingInstance.addProposal(_proposal2, { from: _voter2 })  , requireMessage);
      });

      it("test 8 : try to store an empty proposal. It should revert", async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });

        //decide to add an empty proposal.it should revert
        const requireMessage = "Vous ne pouvez pas ne rien proposer" ;
        await expectRevert(  votingInstance.addProposal( '' , { from: _voter1 }) , requireMessage);
      });
    
      it("test 9 : it should store the first proposal. The description is GENESIS", async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });
        //getProp 0
        const storedData = await votingInstance.getOneProposal(0, { from: _voter1 });
        expect(storedData.description).to.equal("GENESIS");
      });

      it("test 10 : it should store proposal 1 from Voter 1 with description + " + _proposal1 , async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });

        //the voter1 add a proposal
        await votingInstance.addProposal(_proposal1, { from: _voter1 });
        //getProp voter1
        const storedData = await votingInstance.getOneProposal(numeroProposal1, { from: _voter1 });
        expect(storedData.description).to.equal(_proposal1);
      }); 

      it("test 11 : the same voter can add more than one proposal" , async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });

        //the voter1 add a proposal
        await votingInstance.addProposal(_proposal1, { from: _voter1 });
        await votingInstance.addProposal(_proposal2, { from: _voter1 });

        //getProp voter1
        const storedData1 = await votingInstance.getOneProposal(numeroProposal1, { from: _voter1 });
        expect(storedData1.description).to.equal(_proposal1);

        const storedData2 = await votingInstance.getOneProposal(numeroProposal2, { from: _voter1 });
        expect(storedData2.description).to.equal(_proposal2);
      }); 

      it("test 12 : the same voter can add more than one time the same proposal (??)" , async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });

        //the voter1 add a proposal
        await votingInstance.addProposal(_proposal1, { from: _voter1 });
        await votingInstance.addProposal(_proposal1, { from: _voter1 });

        //getProp voter1
        const storedData1 = await votingInstance.getOneProposal(numeroProposal1, { from: _voter1 });
        expect(storedData1.description).to.equal(_proposal1);

        const storedData2 = await votingInstance.getOneProposal(numeroProposal2, { from: _voter1 });
        expect(storedData2.description).to.equal(_proposal1);
      }); 
        

        
      it("test 13 : should emit event on addProposal", async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });

        //add the first voter's proposal (id=1)
        const storedData1= await votingInstance.addProposal(_proposal1, { from: _voter1 });
        //test event 
        expectEvent(storedData1, "ProposalRegistered" , { proposalId: new BN(1)  });
      });

      it("test 14 : only voter can record some new proposal else should revert", async () => {
        //start register new proposal
        await votingInstance.startProposalsRegistering( { from: _owner });
        const messageRequire = "You're not a voter" ;
        await expectRevert( votingInstance.addProposal(_proposal1, { from: _owner }) , messageRequire);
      });

    });
 
    describe("3 - setvote tests ", function (){

      beforeEach(async function () {
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

      it("test 15 : try to vote from outside the voting phase", async () => {
        //try to vote from outside voting session
        const requireMessage = "Voting session havent started yet" ;
        await expectRevert( votingInstance.setVote(voteFromVoter1, { from: _voter1 })  , requireMessage);
      }); 
        
      it("test 16 : only voters can vote else revert", async () => {
        //start voting session
        await votingInstance.startVotingSession( { from: _owner });
        const requireMessage = "You're not a voter" ;
        await expectRevert( votingInstance.setVote(voteFromVoter1, { from: _owner }) , requireMessage);
      });
      
      it("test 17 : only one vote per voter else revert", async () => {
        //start voting session
        await votingInstance.startVotingSession( { from: _owner });
        //first vote
        await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ; 
        //the same voter wants to vote again
        const requireMessage = "You have already voted" ;
        await expectRevert( votingInstance.setVote(voteFromVoter1, { from: _voter1 }), requireMessage);
      });

      it("test 18 : vote for an inexistant proposal", async () => {
        //start voting session
        await votingInstance.startVotingSession( { from: _owner });
        //the  voter votes for an unknow proposal 
        const requireMessage = "Proposal not found" ;
        await expectRevert( votingInstance.setVote( new BN(4), { from: _voter1 }), requireMessage);
      });

      //here is a test that highlights an inconsistency in the program. 
      // The possibility of voting for the proposal 0 (white vote or null vote ?)
      
      it("test 19 : voters can vote for the proposal 0 ( is this normal ???)", async () => {
        //start votin session
        await votingInstance.startVotingSession( { from: _owner });
        await votingInstance.setVote(new BN(0), { from: _voter1 }) ;

        storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
        //the vote1 one has for Genesis (0)
        expect(storedData.votedProposalId).to.be.bignumber.equal(new BN(0));
      });
      
      it("Test 20 : Hasvoted is true after a vote", async () => {
        //start votin session
        await votingInstance.startVotingSession( { from: _owner });
        //vote
        await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;

        storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
        expect(storedData.hasVoted).to.be.true;
      });
      
      it("Test 21 : the storage value of the vote is equal of what the voter votes", async () => {
        //start votin session
        await votingInstance.startVotingSession( { from: _owner });
        //vote
        await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;

        storedData = await votingInstance.getVoter(_voter1, { from: _voter1 });
        expect(storedData.votedProposalId).to.be.bignumber.equal(new BN(voteFromVoter1));
      });

      it("Test 22 : the votecount reflect exactly what it has been voted", async () => {
        //start votin session
        await votingInstance.startVotingSession( { from: _owner });
        //3 same votes
        await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;
        await votingInstance.setVote(voteFromVoter1, { from: _voter2 }) ;
        await votingInstance.setVote(voteFromVoter1, { from: _voter3 }) ;

        storedData = await votingInstance.getOneProposal(voteFromVoter1, { from: _voter1 });
        expect(storedData.voteCount).to.be.bignumber.equal(new BN(3));
      });

      //test  event when vote is done
      it("test 23 : should emit event on vote", async () => {
        //start votin session
        await votingInstance.startVotingSession( { from: _owner });
        //vote
        const storedData = await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;
        //test event
        expectEvent(storedData, "Voted" , { voter:_voter1 , proposalId: new BN(voteFromVoter1) });

      });

    });

    describe("4 - startProposalsRegistering tests", function (){

      beforeEach(async function () {
      });

      it("test 24 : startProposalsRegistering could only be lauch from  owner adress", async () => {
        //the  voter votes for an unknow proposal 
        const requireMessage = "Ownable: caller is not the owner" ;
        await expectRevert(votingInstance.startProposalsRegistering( { from: _voter1 }), requireMessage);
      }); //fin du it
      

      it("test 25 : startProposalsRegistering could only be launch from RegisteringVoters Workflow's Status ", async () => {
        await votingInstance.startProposalsRegistering( { from: _owner });   
        await votingInstance.endProposalsRegistering( { from: _owner });   

        //try to  startProposalsRegistering after the endProposalsRegistering
        const requireMessage = "Registering proposals cant be started now" ;
        await expectRevert(votingInstance.startProposalsRegistering( { from: _owner }), requireMessage);
      });


      it("test 26 : the startProposalsRegistering create the GENESIS proposal ID 0", async () => {
        //the owner add 1 voter
        await votingInstance.addVoter(_voter1, { from: _owner });
        //start Proposals Registering
        await votingInstance.startProposalsRegistering( { from: _owner });

        const storedData = await votingInstance.getOneProposal(0, { from: _voter1 });
        expect(storedData.description).to.equal("GENESIS");
      });


      //test  event when vote is done
      it("test 27 : emit an event on startProposalsRegistering", async () => {
          const storedData = await votingInstance.startProposalsRegistering( { from: _owner });
          //test event
          expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(0), newStatus:new BN(1)});
      });

    }); 

    describe("5 - endProposalsRegistering tests", function (){

      beforeEach(async function () {
        //owner add 3 voters
        await votingInstance.addVoter(_voter1, { from: _owner });
        await votingInstance.addVoter(_voter2, { from: _owner });
        await votingInstance.addVoter(_voter3, { from: _owner });
      });

      it("test 28 : endProposalsRegistering could only be lauch from owner adress else revert", async () => {
        await votingInstance.startProposalsRegistering( { from: _owner });
        const requireMessage = "Ownable: caller is not the owner" ;
        await expectRevert(votingInstance.endProposalsRegistering( { from: _voter1 }), requireMessage);
      }); //fin du it
      

      it("test 29 : endProposalsRegistering could only be launch from ProposalsRegistrationStarted Workflow's Status else revert", async () => {
        //still in RegisteringVoters Workflow's Status
        const requireMessage = "Registering proposals havent started yet" ;
        await expectRevert(votingInstance.endProposalsRegistering( { from: _owner }), requireMessage);
      });

      it("test 30 : should emit event on endProposalsRegistering", async () => {
        await votingInstance.startProposalsRegistering( { from: _owner });
        const storedData = await votingInstance.endProposalsRegistering( { from: _owner });
        //test event
        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(1), newStatus:new BN(2)});
      });

    }); 

    describe("6 - startVotingSession tests", function (){

      beforeEach(async function () {
        //owner add 3 voters
        await votingInstance.addVoter(_voter1, { from: _owner });
        await votingInstance.addVoter(_voter2, { from: _owner });
        await votingInstance.addVoter(_voter3, { from: _owner });

        await votingInstance.startProposalsRegistering( { from: _owner });
        await votingInstance.addProposal(_proposal1, { from: _voter1 });
        await votingInstance.addProposal(_proposal2, { from: _voter2 });
        await votingInstance.addProposal(_proposal3, { from: _voter3 });

        //still in proposal registering
      });

      it("test 31 : startVotingSession could only be lauch from owner adress else revert", async () => {
        //close proposal registering
        await votingInstance.endProposalsRegistering( { from: _owner });
        const requireMessage = "Ownable: caller is not the owner" ;
        await expectRevert(votingInstance.startVotingSession( { from: _voter1 }), requireMessage);
      }); 

      it("test 32 : startVotingSession could only be launch from ProposalsRegistrationEnded Workflow's Status else revert", async () => {
        //still in proposal registering
        const requireMessage = "Registering proposals phase is not finished" ;
        await expectRevert(votingInstance.startVotingSession( { from: _owner }), requireMessage);
      });

      it("test 33 : should emit event on startVotingSession", async () => {
        //close proposal registering
        await votingInstance.endProposalsRegistering( { from: _owner });
        const storedData = await votingInstance.startVotingSession( { from: _owner });
        //test event
        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(2), newStatus:new BN(3)});
      });

    }); 

    describe("7 - endVotingSession tests", function (){

        beforeEach(async function () {
          //owner add 3 voters
          await votingInstance.addVoter(_voter1, { from: _owner });
          await votingInstance.addVoter(_voter2, { from: _owner });
          await votingInstance.addVoter(_voter3, { from: _owner });
          //each voter add 1 proposal
          await votingInstance.startProposalsRegistering( { from: _owner });
          await votingInstance.addProposal(_proposal1, { from: _voter1 });
          await votingInstance.addProposal(_proposal2, { from: _voter2 });
          await votingInstance.addProposal(_proposal3, { from: _voter3 });
          await votingInstance.endProposalsRegistering( { from: _owner });
        });

      it("test 34 : endVotingSession could only be lauch from owner adress else revert", async () => {
        //start voting
        await votingInstance.startVotingSession( { from: _owner });

        //the  voter votes for an unknow proposal 
        const requireMessage = "Ownable: caller is not the owner" ;
        await expectRevert(votingInstance.endVotingSession( { from: _voter1 }), requireMessage);
      }); //fin du it
      
      it("test 35 : endVotingSession could only be launch from VotingSessionStarted Workflow's Status else revert", async () => {
        //dont't start voting
        const requireMessage = "Voting session havent started yet" ;
        await expectRevert(votingInstance.endVotingSession( { from: _owner }), requireMessage);
      });

      it("test 36 : should emit event on endVotingSession", async () => {
        await votingInstance.startVotingSession( { from: _owner });
        const storedData = await votingInstance.endVotingSession( { from: _owner });
        //test event
        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(3), newStatus:new BN(4)});
      });


    }); //fin du describe 7

    describe("8 - tallyVotes tests", function (){

      beforeEach(async function () {
        //owner add 3 voters
        await votingInstance.addVoter(_voter1, { from: _owner });
        await votingInstance.addVoter(_voter2, { from: _owner });
        await votingInstance.addVoter(_voter3, { from: _owner });
        //each voter add 1 proposal
        await votingInstance.startProposalsRegistering( { from: _owner });
        await votingInstance.addProposal(_proposal1, { from: _voter1 });
        await votingInstance.addProposal(_proposal2, { from: _voter2 });
        await votingInstance.addProposal(_proposal3, { from: _voter3 });
        await votingInstance.endProposalsRegistering( { from: _owner });

        await votingInstance.startVotingSession( { from: _owner });
    
      });

      it("test 37 : tallyVotes could only be lauch from owner adress else revert", async () => {
        await votingInstance.endVotingSession( { from: _owner });
        const requireMessage = "Ownable: caller is not the owner" ;
        await expectRevert(votingInstance.tallyVotes( { from: _voter1 }), requireMessage);
      }); 
      
      it("test 38 : tallyVotes could only be launch from VotingSessionEnded Workflow's Status else revert", async () => {
        //still in VotingSessionStarted Workflow's Status
        const requireMessage = "Current status is not voting session ended" ;
        await expectRevert(votingInstance.tallyVotes( { from: _owner }), requireMessage);
      });

      it("test 39 : should emit event on tallyVotes", async () => {
        //close voting
        await votingInstance.endVotingSession( { from: _owner });
        const storedData = await votingInstance.tallyVotes( { from: _owner });
        //test event
        expectEvent(storedData, "WorkflowStatusChange" , {previousStatus:new BN(4), newStatus:new BN(5)});
      });

      it("test 40 : the proposal 1 is winner ", async () => {
        //set the vote
        await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;
        await votingInstance.setVote(voteFromVoter1, { from: _voter2 }) ;
        await votingInstance.setVote(voteFromVoter1, { from: _voter3 }) ;

        //close the vote session + tally
        await votingInstance.endVotingSession( { from: _owner });
        await votingInstance.tallyVotes( { from: _owner });

        const storedData = await votingInstance.winningProposalID();
        expect(new BN(storedData)).to.be.bignumber.equal(new BN(1));
      });

      //test  event when Workflow Status change
      it("test 41 : is the proposal 2 is winner ", async () => {

        //set the vote
        await votingInstance.setVote(voteFromVoter2, { from: _voter1 }) ;
        await votingInstance.setVote(voteFromVoter2, { from: _voter2 }) ;
        await votingInstance.setVote(voteFromVoter1, { from: _voter3 }) ;

        //close the vote session + tally
        await votingInstance.endVotingSession( { from: _owner });
        await votingInstance.tallyVotes( { from: _owner });

        const storedData = await votingInstance.winningProposalID();

        expect(new BN(storedData)).to.be.bignumber.equal(new BN(2));
            
      });

      it("test 42 : the proposal 0 genesis could be winner (???) ", async () => {

        //set the vote
        await votingInstance.setVote(0, { from: _voter1 }) ;
        await votingInstance.setVote(0, { from: _voter2 }) ;
        await votingInstance.setVote(0, { from: _voter3 }) ;

        //close the vote session + tally
        await votingInstance.endVotingSession( { from: _owner });
        await votingInstance.tallyVotes( { from: _owner });

        const storedData = await votingInstance.winningProposalID();
        expect(new BN(storedData)).to.be.bignumber.equal(new BN(0));

      });         

      it("test 43 : if any exaequo only the lower id is sent (???)", async () => {

        //set the vote every voter votes for his proposal = 3 ex aequo
        await votingInstance.setVote(voteFromVoter1, { from: _voter1 }) ;
        await votingInstance.setVote(voteFromVoter2, { from: _voter2 }) ;
        await votingInstance.setVote(voteFromVoter3, { from: _voter3 }) ;
    
        //close the voting session
        await votingInstance.endVotingSession( { from: _owner });
        await votingInstance.tallyVotes( { from: _owner });
    
        const storedData = await votingInstance.winningProposalID();
        expect(new BN(storedData)).to.be.bignumber.equal(new BN(1));
    
      });
      
    }); 

  }); //fin du describe general
   
}); //fin du contrat


