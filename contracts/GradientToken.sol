pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// all gradient tokens in existence inherit this class
contract GradientToken is ERC721, Ownable {
   constructor() ERC721("GradientToken", "GRAD") public {
    }
    struct Gradient {
        string outer;
        string inner;
    }
    Gradient[] gradients;
    
    function mint(string memory _outer, string memory _inner) public payable {
        require(msg.value >= 5);

        Gradient memory _gradient = Gradient({ outer: _outer, inner: _inner });
        gradients.push(_gradient);
        uint _gradientId = gradients.length - 1;
        // gradientID is tokenID?
        _mint(msg.sender, _gradientId);
    }

    function getGradient( uint _gradientId ) public view returns(string memory outer, string memory inner){
        Gradient memory _grad = gradients[_gradientId];

        outer = _grad.outer;
        inner = _grad.inner;
    }
}