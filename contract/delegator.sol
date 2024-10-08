// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;



interface IERC20{
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}
interface Admin{
    function add_delegate(address _delegate) external ;
    
    function add_delegator(address _owner) external ;
    
}


/**
 * @title Delegator
 * @dev Deleegate permissions to account
 */
contract Delegator {

    address private owner;
    address private admin;
    address public token_address;
    struct delegate {
        bool is_resticted;
        string name;
        address delegate; // person delegated to
        uint daily_transactions;
        uint256 daily_amount;
        uint256 transastion_delay;
        uint256 transaction_limit;// weight is accumulated by delegation
        uint256 last_timestamp;
        uint256 today_spent;
        uint256 today_transctions;
    }
    mapping(address => delegate) public delegate_accounts;
    address[] public delegates_address;
    
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    modifier isAdmin() {
        require(msg.sender == admin, "Caller is not owner");
        _;
    }
    
    modifier isDelegate(){
        bool is_present = false;
        for (uint256 i = 0; i < delegates_address.length; i++) {
            if (delegates_address[i] == msg.sender) {
                is_present =true;
                break;
            }
        }
        require(is_present, "Caller is not delegated account");
        _;
    }
    
    constructor(address _token_address, address _admin ) {
        owner = msg.sender;
        admin = _admin;
        Admin(admin).add_delegator(msg.sender);
        token_address= _token_address;
    }
    
    
    
    function register_delegate(string memory _name,
        address _delegate, // person delegated to
        uint _daily_transactions,
        uint256 _daily_amount,
        uint256 _transastion_delay,
        uint256 _transaction_limit// weight is accumulated by delegation
        ) external isOwner{
        require(_transaction_limit<=_daily_amount, "daily_amount less than transacton limit ");
        require(_daily_transactions>0);
        require(_transastion_delay<86400);
        delegate_accounts[_delegate]= delegate({
            is_resticted : false,
            name : _name,
            delegate : _delegate,
            daily_transactions : _daily_transactions,
            daily_amount : _daily_amount,
            transastion_delay : _transastion_delay,
            transaction_limit : _transaction_limit,
            last_timestamp : block.timestamp,
            today_spent : 0,
            today_transctions : 0
        });
        
        delegates_address.push(_delegate);
        // run add delegate account in admin
        Admin(admin).add_delegate(_delegate);
        
    }
    
    function delegated_transaction(address _receiver, uint256 _amount) external isDelegate{
        delegate memory account= delegate_accounts[msg.sender];
        
        require(!account.is_resticted, "Delegate restricted");
        require(_amount < account.transaction_limit,"Amount more than transaction limit");
        if (account.last_timestamp % 86400 != block.timestamp){
            // send transaction
            IERC20(token_address).transferFrom(admin, _receiver,_amount);
            // end transaction
            account.last_timestamp = block.timestamp;
            account.today_transctions = 1;
            account.today_spent = _amount;
        }
        
        else{
            require(block.timestamp-account.last_timestamp > account.transastion_delay, "Wait for minimum amount of delay");
            require(account.today_spent+_amount < account.daily_amount,"daily spend quota exceeded ");
            require(account.today_transctions+1 < account.transaction_limit, "daily transaction limit exceeded");
            // send transaction
            IERC20(token_address).transferFrom(admin, _receiver,_amount);
            // end transaction
            account.last_timestamp = block.timestamp;
            account.today_transctions += 1;
            account.today_spent += _amount;
        }
    }
    
    
    function update_delegate(address _delegate, // person delegated to
        uint _daily_transactions,
        uint256 _daily_amount,
        uint256 _transastion_delay,
        uint256 _transaction_limit) external isOwner{
            delegate_accounts[_delegate].transaction_limit=_transaction_limit;
            delegate_accounts[_delegate].daily_transactions = _daily_transactions;
            delegate_accounts[_delegate].daily_amount = _daily_amount;
            delegate_accounts[_delegate].transastion_delay =_transastion_delay;
        }

    function restrict_delegate(address _delegate) external isOwner{
        delegate_accounts[_delegate].is_resticted = true;
    }
    
    function restrict_delegate_admin(address _delegate) external isAdmin{
        delegate_accounts[_delegate].is_resticted = true;
    }
    
    function unrestrict_delegate(address _delegate) external isOwner{
        delegate_accounts[_delegate].is_resticted = false;
    }
    
    function get_delegate_info(address _delegate) public view returns (delegate memory){
        return delegate_accounts[_delegate];
    }
    
    
}