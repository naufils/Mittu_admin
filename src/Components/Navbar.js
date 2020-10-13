import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
  import { NavLink as NavLinkReactor } from 'react-router-dom';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div style={{width:'100%', borderBottom:'3px solid #F9A818'}}>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/" style={{fontSize:30, fontWeight:'bold', color:'#F9A818'}}>HomeTheater Admin</NavbarBrand>
          <Nav navbar style={{border:'4px solid black', marginLeft:'auto', backgroundColor:'#F9A818'}}>
            <NavItem>
                <NavLink href={"/admin/upload"}>
                  {/* <NavLinkReactor to={this.props.match.url+"/admin/upload"} style={{fontSize:18, fontWeight:'bold'}}>UPLOAD</NavLinkReactor> */}
                  UPLOAD
                </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}