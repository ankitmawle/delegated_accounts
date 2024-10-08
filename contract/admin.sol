// SPDX-License-Identifier: GPL-3.0


pragma solidity >=0.7.0 <0.9.0;



interface Delegator{
     function restrict_delegate_admin(address _delegate) external ;
}


/**
 * @title Delegator
 * @dev Deleegate permissions to account
 */
contract Admin {

    address private admin;
    mapping(address => address) public delegate_accounts;
    mapping(address => address) public owner_delgators;
    address[] public delegators;
    modifier isAdmin() {
        require(msg.sender == admin, "Caller is not owner");
        _;
    }
    
    modifier isDelegator(){
        bool is_present = false;
        for (uint256 i = 0; i < delegators.length; i++) {
            if (delegators[i] == msg.sender) {
                is_present =true;
                break;
            }
        }
        require(is_present, "Caller is not a regitered delegator account");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    function add_delegate(address _delegate) external isDelegator{
        delegate_accounts[_delegate]= msg.sender;
    }
    
    function add_delegator(address _owner) external {
        delegators.push(msg.sender);
        owner_delgators[_owner]=msg.sender;
    }
    
    function get_delegator_account(address _delegate) public view returns(address){
        return delegate_accounts[_delegate];
    }
    
    function get_owner_delegator(address _owner) public view returns(address){
        return owner_delgators[_owner];
    }
    
    
    function restrict_delegate(address _delegate)external isAdmin{
        Delegator(delegate_accounts[_delegate]).restrict_delegate_admin(_delegate);
    }
}