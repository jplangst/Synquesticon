import React from 'react';
import { styled } from '@material-ui/styles';
import { deepOrange, deepPurple } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';

const BlueAvatar = styled(Avatar)({
  padding: 10,
  color: '#fff',
  backgroundColor: deepPurple[500],
});

export default function StyledAvatar(props) {
  return <BlueAvatar>{props.ID}</BlueAvatar>;
}
