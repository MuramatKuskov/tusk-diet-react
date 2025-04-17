import React from 'react';
import './User.css';
import EditableList from '../../UI/EditableList/EditableList';

const User = (props) => {
	return (
		<div className='page page-user user'>
			<EditableList />
		</div>
	);
};

export default User;