# TESTS FILE OF THE VOTING.SOL PROJECT

This test

## Getting started

you are suppose to have a project folder with Truffle installed.
The contract : Voting.sol
The module needed : @openzeppelin/test-helpers + chai library


put the file 01_test01.js in your test folder of your project.

in the terminal :  truffle test test/01_TEST.js


## COVER

The tests are divided in 8 sections 

truffle test test/01-test1.js 
Using network 'development'.


Compiling your contracts...
===========================
> Compiling ./contracts/Voting.sol
> Compiling ./node_modules/@openzeppelin/contracts/access/Ownable.sol
> Compiling ./node_modules/@openzeppelin/contracts/utils/Context.sol
> Artifacts written to /tmp/test--12471-c14fveBgpJYI
> Compiled successfully using:
   - solc: 0.8.17+commit.8df45f5f.Emscripten.clang

  Contract: Voting
    general
      1 - addvoter tests
        ✓ test 1 : try to store new voter from toher adress than the owner (488ms)
        ✓ test 2 : try to store new voter from other voting phase (107ms, 145252 gas)
        ✓ test 3 : try to store 2 times the same voter (98ms, 100440 gas)
        ✓ test 4 : add a voter, the isregistred flag is true. (47ms, 50220 gas)
        ✓ test 5 : add a voter, the hasVoted flag is false (40ms, 50220 gas)
        ✓ test 6 : should emit event on addVoter (35ms, 50220 gas)
        
      2 - addProposal tests
        ✓ test 7 : should revert if you try to store new proposal from the add voters phase. (16ms)
        ✓ test 8 : try to store an empty proposal. It should revert (98ms, 95032 gas)
        ✓ test 9 : it should store the first proposal. The description is GENESIS (48ms, 95032 gas)
        ✓ test 10 : it should store proposal 1 from Voter 1 with description + first proposal (104ms, 154360 gas)
        ✓ test 11 : the same voter can add more than one proposal (164ms, 213700 gas)
        ✓ test 12 : the same voter can add more than one time the same proposal (??) (143ms, 213688 gas)
        ✓ test 13 : should emit event on addProposal (106ms, 154360 gas)
        ✓ test 14 : only voter can record some new proposal else should revert (59ms, 95032 gas)
        
      3 - setvote tests 
        ✓ test 15 : try to vote from outside the voting phase (21ms)
        ✓ test 16 : only voters can vote else revert (37ms, 30554 gas)
        ✓ test 17 : only one vote per voter else revert (85ms, 108567 gas)
        ✓ test 18 : vote for an inexistant proposal (53ms, 30554 gas)
        ✓ test 19 : voters can vote for the proposal 0 ( is this normal ???) (129ms, 88655 gas)
        ✓ Test 20 : Hasvoted is true after a vote (77ms, 108567 gas)
        ✓ Test 21 : the storage value of the vote is equal of what the voter votes (67ms, 108567 gas)
        ✓ Test 22 : the votecount reflect exactly what it has been voted (155ms, 230393 gas)
        ✓ test 23 : should emit event on vote (71ms, 108567 gas)
        
      4 - startProposalsRegistering tests
        ✓ test 24 : startProposalsRegistering could only be lauch from  owner adress (12ms)
        ✓ test 25 : startProposalsRegistering could only be launch from RegisteringVoters Workflow's Status  (69ms, 125631 gas)
        ✓ test 26 : the startProposalsRegistering create the GENESIS proposal ID 0 (206ms, 145252 gas)
        ✓ test 27 : emit an event on startProposalsRegistering (60ms, 95032 gas)
        
      5 - endProposalsRegistering tests
        ✓ test 28 : endProposalsRegistering could only be lauch from owner adress else revert (65ms, 95032 gas)
        ✓ test 29 : endProposalsRegistering could only be launch from ProposalsRegistrationStarted Workflow's Status else revert (62ms)
        ✓ test 30 : should emit event on endProposalsRegistering (84ms, 125631 gas)
        
      6 - startVotingSession tests
        ✓ test 31 : startVotingSession could only be lauch from owner adress else revert (31ms, 30599 gas)
        ✓ test 32 : startVotingSession could only be launch from ProposalsRegistrationEnded Workflow's Status else revert (9ms)
        ✓ test 33 : should emit event on startVotingSession (54ms, 61153 gas)
        
      7 - endVotingSession tests
        ✓ test 34 : endVotingSession could only be lauch from owner adress else revert (36ms, 30554 gas)
        ✓ test 35 : endVotingSession could only be launch from VotingSessionStarted Workflow's Status else revert (14ms)
        ✓ test 36 : should emit event on endVotingSession (94ms, 61087 gas)
        
      8 - tallyVotes tests
        ✓ test 37 : tallyVotes could only be lauch from owner adress else revert (32ms, 30533 gas)
        ✓ test 38 : tallyVotes could only be launch from VotingSessionEnded Workflow's Status else revert (11ms)
        ✓ test 39 : should emit event on tallyVotes (69ms, 77094 gas)
        ✓ test 40 : the proposal 1 is winner  (182ms, 296841 gas)
        ✓ test 41 : is the proposal 2 is winner  (178ms, 313949 gas)
        ✓ test 42 : the proposal 0 genesis could be winner (???)  (175ms, 217197 gas)
        ✓ test 43 : if any exaequo only the lower id is sent (???) (162ms, 331041 gas)


  43 passing (37s)


## GAS

·------------------------------------------|----------------------------|-------------|----------------------------·
|   Solc version: 0.8.17+commit.8df45f5f   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|····························|·············|·····························
|  Methods                                                                                                         │
·············|·····························|··············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·       59328  ·      59340  ·      59332  ·          77  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      50220  ·         112  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·          28  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·           9  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·       41001  ·      78013  ·      68922  ·          26  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      95032  ·          42  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·          23  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·       46561  ·      66477  ·      57623  ·           9  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    2077414  ·      30.9 %  ·          -  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·




