pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// all epic tokens in existence inherit this class
contract EpicToken is ERC721, Ownable {
   constructor() ERC721("EpicToken", "EPIC") public {
    }
    struct Epic {
        string outer;
        string inner;
    }
    Epic[] epics;
    
    function mint(string memory _outer, string memory _inner) public payable {
        require(msg.value >= 5);

        Epic memory _epic = Epic({ outer: _outer, inner: _inner });
        epics.push(_epic);
        uint _epicId = epics.length - 1;
        // epicID is tokenID?
        _mint(msg.sender, _epicId);
    }

    function getEpic( uint _epicId ) public view returns(string memory outer, string memory inner){
        Epic memory _epic = epics[_epicId];

        outer = _epic.outer;
        inner = _epic.inner;
    }
}