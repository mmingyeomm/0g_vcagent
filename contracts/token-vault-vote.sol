// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AGENT is ERC20, Ownable {
    constructor(address initialOwner) ERC20("AGENT", "AGT") Ownable(initialOwner) {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // --- Vault 구조 (단순화) ---
    struct Proposal {
        uint256 agendaNumber;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
    }

    uint256 public vaultCount;
    mapping(uint256 => uint256) public vaultProject; // vaultId → projectId
    mapping(uint256 => mapping(address => uint256)) public vaultBalances; // vaultId → user → amount
    mapping(uint256 => uint256) public vaultTotal; // vaultId → total deposit

    // vaultId → proposalId → Proposal
    mapping(uint256 => mapping(uint256 => Proposal)) public proposals;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) public hasVoted; // vaultId → proposalId → user → voted

    mapping(uint256 => uint256) public proposalCounts; // vaultId → proposalCount

    // --- Vault 관리 ---
    function createVault(uint256 projectId) external onlyOwner {
        vaultProject[vaultCount] = projectId;
        vaultCount++;
    }

    function deposit(uint256 vaultId, uint256 amount) external {
        _transfer(msg.sender, address(this), amount);
        vaultBalances[vaultId][msg.sender] += amount;
        vaultTotal[vaultId] += amount;
    }

    function withdraw(uint256 vaultId, uint256 amount) external {
        require(vaultBalances[vaultId][msg.sender] >= amount, "not enough");
        vaultBalances[vaultId][msg.sender] -= amount;
        vaultTotal[vaultId] -= amount;
        _transfer(address(this), msg.sender, amount);
    }

    // --- Proposal & Vote ---
    function createProposal(uint256 vaultId, uint256 agendaNumber) external onlyOwner {
        uint256 id = proposalCounts[vaultId]++;
        proposals[vaultId][id] = Proposal(agendaNumber, 0, 0, false);
    }

    function vote(uint256 vaultId, uint256 proposalId, bool support) external {
        require(!hasVoted[vaultId][proposalId][msg.sender], "already voted");

        uint256 power = vaultBalances[vaultId][msg.sender];
        require(power > 0, "no voting power");

        Proposal storage p = proposals[vaultId][proposalId];
        require(!p.executed, "already executed");

        if (support) p.yesVotes += power;
        else p.noVotes += power;

        hasVoted[vaultId][proposalId][msg.sender] = true;
    }

    function execute(uint256 vaultId, uint256 proposalId) external {
        Proposal storage p = proposals[vaultId][proposalId];
        require(!p.executed, "already executed");
        require(p.yesVotes > vaultTotal[vaultId] / 2, "not enough yes votes");

        p.executed = true;
    }
}
