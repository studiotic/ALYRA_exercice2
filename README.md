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

studiotic@NUNGESSER:~/CoursAlyra/exercice2$ truffle test test/01-test1.js 
Using network 'development'.


Compiling your contracts...
===========================
> Compiling ./contracts/Voting.sol
> Compiling ./node_modules/@openzeppelin/contracts/access/Ownable.sol
> Compiling ./node_modules/@openzeppelin/contracts/utils/Context.sol
> Artifacts written to /tmp/test--16562-HWRF6iKTNx26
> 
> Compiled successfully using:
   - solc: 0.8.17+commit.8df45f5f.Emscripten.clang
   - 


  Contract: Voting
    general
      1-Test du ADD VOTER
        ✓ test1 : try to store new voter from not owner adress (420ms)
        ✓ test2 : try to store new voter from other voting phase (101ms, 145252 gas)
        ✓ test3 : try to store 2 times the same voter (85ms, 100440 gas)
        ✓ test4 : it should store voter in array, getVoter isRegistred (59ms, 50220 gas)
        ✓ test5 : it should store voter in array, getVoter hasVoted (43ms, 50220 gas)
        ✓ test6 : should emit event on ADD VOTER (37ms, 50220 gas)
        
      2-Test du ADD PROPOSAL
        ✓ test7 : try to store new proposal from the first voting phase (add voters) (14ms)
        ✓ test8 : try to store an empty proposal by owner (58ms, 95032 gas)
        ✓ test 9 : it should store a proposal 0 genesis in array, getOneProposal 0 has description Genesis (52ms, 95032 gas)
        ✓ test 10 : it should store  proposal 1 from Voter 1 with description + control : first proposal (91ms, 154360 gas)
        ✓ test11 : should emit event on ADD PROPOSAL (157ms, 213700 gas)
        ✓ test 12 : only voter can rec some proposal (49ms, 95032 gas)
        
      3-Test du SET  VOTE
        ✓ test13 : try to vote from outside the voting phase (18ms)
        ✓ test 14 : only voters can vote (39ms, 30554 gas)
        ✓ test 15 : only one voter per voter (79ms, 108567 gas)
        ✓ test 16 : vote for an inexistant proposal (48ms, 30554 gas)
        ✓ test 17 : vote for the proposal 0 possible( is this normal ???) (81ms, 88655 gas)
        ✓ Test 18 : is Hasvoted true after a vote (84ms, 108567 gas)
        ✓ Test 19 : the storage value of the vote equal what he votes (76ms, 108567 gas)
        ✓ Test 20 : the storage value of the vote equal what he votes (149ms, 230393 gas)
        ✓ test21 : should emit event on vote (56ms, 108567 gas)
        
      4-Test du startProposalsRegistering
        ✓ test22 : try to start proposal registrering from voter adress (26ms)
        ✓ test 23 : try to call this function from other pahse of the vote (78ms, 125631 gas)
        ✓ test 24 : does the genesis created .. (74ms, 145252 gas)
        ✓ test 25 : should emit event on start Proposals Registering (46ms, 95032 gas)
        
      5-Test du endProposalsRegistering
        ✓ test 26 : try to end Proposals Registering from voter adress (46ms, 95032 gas)
        ✓ test 27 : try to call this function from other phase of the vote (10ms)
        ✓ test 28 : should emit event on End Proposals Registering (75ms, 125631 gas)
        
      6-Test du startVotingSession
        ✓ test 29 : try to start Voting Session from voter adress (78ms, 125631 gas)
        ✓ test 30 : try to call this function from other phase of the vote (119ms)
        ✓ test 31 : should emit event on start Voting Session (107ms, 156185 gas)
        
      7-Test du endVotingSession
        ✓ test 32 : try to end Voting Session from voter's adress (110ms, 156185 gas)
        ✓ test 33 : try to call this function from other phase of the vote (13ms)
        ✓ test 34 : should emit event on start Voting Session (139ms, 186718 gas)
        
      8-Test of tallyVotes
        ✓ test 35 : try to call tallyVotes from voter's adress (10ms)
        ✓ test 36 : try to call this function from other phase of the vote (9ms)
        ✓ test 37 : should emit event on tallyVotes (74ms, 77094 gas)
        ✓ test 38 : the propsal 1 is winner  (193ms, 296841 gas)
        ✓ test 39 : is the proposal 2 is winner  (166ms, 313949 gas)
        ✓ test 40 : is the proposal 0 genesis could be winner (???)  (193ms, 217197 gas)
        ✓ test 41 : all exaequo but the first is sent (162ms, 331041 gas)

41 passing (31s)


## GAS

·------------------------------------------|----------------------------|-------------|----------------------------·
|   Solc version: 0.8.17+commit.8df45f5f   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|····························|·············|·····························
|  Methods                                                                                                         │
·············|·····························|··············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  eur (avg)  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·       59328  ·      59340  ·      59332  ·          53  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      50220  ·          78  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·          26  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·           7  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·       41001  ·      78013  ·      68922  ·          26  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      95032  ·          38  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·          24  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·       46561  ·      66477  ·      57623  ·           9  ·          -  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    2077414  ·      30.9 %  ·          -  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·

