// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract RandomElementsWithMoleFraction is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface public COORDINATOR;

    uint64 public subId;
    bytes32 public keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a9296ecaeda5da31c26f;
    uint32 public callbackGas = 200_000;
    uint16 public reqConf = 3;
    uint32 public numWords = 3;

    string[] public elements = [
      "Sc","Li","Ti","Na","V","K","Cr","Rb","Mn","Cs",
      "Fe","Cu","Co","Ag","Ni","Au","Y","Ca","Zr","Sr",
      "Nb","Ba","Mo","Be","Tc","Mg","Ru","Zn","Rh","Cd",
      "Pd","Hg","La","Al","Hf","Ga","Ta","In","W","Tl",
      "Re","Si","Os","Ge","Ir","Sn","Pt","Pb","Th","As",
      "U","Sb","Pu","Bi"
    ];

    uint256 public lastRequestId;
    string public elem1;
    string public elem2;
    uint256 public moleFraction;

    event RequestSent(uint256 indexed requestId);
    event Result(string e1, string e2, uint256 moleFrac);

    constructor(uint64 _subId, address vrfCoordinator)
        VRFConsumerBaseV2(vrfCoordinator)
    {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        subId       = _subId;
    }

    function requestAll() external returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            subId,
            reqConf,
            callbackGas,
            numWords
        );
        lastRequestId = requestId;
        emit RequestSent(requestId);
    }

    function fulfillRandomWords(uint256, uint256[] memory r) internal override {
        require(r.length == 3, "Expect 3 random words");
        elem1 = elements[r[0] % elements.length];
        elem2 = elements[r[1] % elements.length];
        moleFraction = r[2] % 1001;
        emit Result(elem1, elem2, moleFraction);
    }

    function getResult()
      external
      view
      returns (string memory, string memory, uint256)
    {
        return (elem1, elem2, moleFraction);
    }
}