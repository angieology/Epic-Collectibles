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
        string element;
        string name;
        // store json string
        string stats;
        string abilities;
    }
    Epic[] epics;
    
    function mint(
        string memory _outer, 
        string memory _inner,
        string memory _element,
        string memory _name,
        string memory _stats,
        string memory _abilities
        ) public payable {
        require(msg.value >= 5);

        Epic memory _epic = Epic({ 
            outer: _outer, 
            inner: _inner,
            element: _element,
            name: _name,
            stats: _stats,
            abilities: _abilities
         });
        epics.push(_epic);
        uint _epicId = epics.length - 1;
        _mint(msg.sender, _epicId);
    }

    function getEpic( uint _epicId ) public view returns(
        string memory outer, 
        string memory inner,
        string memory element,
        string memory name,
        string memory stats,
        string memory abilities
        ){
        Epic memory _epic = epics[_epicId];

        outer = _epic.outer;
        inner = _epic.inner;
        element = _epic.element;
        name = _epic.name;
        stats = _epic.stats;
        abilities = _epic.abilities;
    }
}