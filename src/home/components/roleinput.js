import React from 'react';


const RoleInput = ({ role, onRoleChange }) => {
    return (
        <div className="role-input">
            <label className='model-instructions'>Model Role</label>
            <textarea className='role-input-field'
                type="text"
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                placeholder='paste role for each model from above or write '
                required
            />
        </div>
    );
};


export default RoleInput;

