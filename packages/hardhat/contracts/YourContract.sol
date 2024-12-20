//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    // State Variables
    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }
    struct Proposal {
        string name;
        string description;
        uint256 voteCount;
    }

    address public immutable owner;
    bool public votingActive = false;
    bool public votingHasStarted = false;
    mapping(address => Voter) public voters;
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalsCount = 0;

    // Constructor: Called once on contract deployment
    // Check packages/hardhat/deploy/00_deploy_your_contract.ts
    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier voitingIsActive() {
        require(votingActive, "Voting not active.");
        _;
    }

    modifier voitingNotActive() {
        require(!votingActive, "Voting has sarted.");
        _;
    }

    modifier voitingNotEnded() {
        require(votingActive || !votingHasStarted, "Voting has ended.");
        _;
    }

    event VotingStarted();
    event VotingEnded();

    // Начало голосования (только администратор)
    function startVoting() public onlyOwner {
        require(!votingHasStarted, "Voting has already started before");
        votingHasStarted = true;
        votingActive = true;
        emit VotingStarted();
    }

    // Завершение голосования (только администратор)
    function endVoting() public onlyOwner {
        votingActive = false;
        emit VotingEnded();
    }

    function addProposal(string memory _name, string memory _description) external onlyOwner {
        require(!votingHasStarted, "Voting has already started");
        proposals[proposalsCount++] = Proposal({name: _name, description: _description, voteCount: 0});
    }

    function giveRightToVote(address voter) external onlyOwner voitingNotEnded {
        require(!voters[voter].voted, "The voter already voted.");
        require(voters[voter].weight == 0, "Voter already has the right to vote.");
        voters[voter].weight = 1;
    }

    function delegate(address to) external voitingIsActive {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "You have no right to vote");
        require(!sender.voted, "You already voted.");
        require(to != msg.sender, "Self-delegation is disallowed.");

        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation.");
        }

        Voter storage delegate_ = voters[to];
        require(delegate_.weight >= 1, "Delegate has no voting weight.");

        sender.voted = true;
        sender.delegate = to;

        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
            delegate_.weight += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    function revokeDelegation() external voitingIsActive {
        Voter storage sender = voters[msg.sender];
        require(sender.voted, "You haven't delegated your vote.");
        require(sender.delegate != address(0), "No delegation to revoke.");

        Voter storage delegate_ = voters[sender.delegate];
        if (!delegate_.voted) {
            delegate_.weight -= sender.weight;
        } else {
            proposals[delegate_.vote].voteCount -= sender.weight;
            delegate_.weight -= sender.weight;
        }

        sender.voted = false;
        sender.delegate = address(0);
    }

    function vote(uint256 proposal) external voitingIsActive {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "Has no right to vote");
        require(!sender.voted, "Already voted.");

        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposalsCount; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (string memory winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
