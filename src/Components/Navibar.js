import React ,{ Component } from 'react';
import { Navbar } from 'react-bootstrap';
import { FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';
import InfoModal from './InfoModal'
 
// export const NaviBar = () => (
//     <>
//         <Navbar bg="primary" variant="dark">
//             <Navbar.Brand href="/" className="ameri-logo">
//                 <img alt="Ameri100" style={{ "width": "7rem", "marginBottom": "5px" }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Ameri100_logo.png/320px-Ameri100_logo.png"></img>
//             </Navbar.Brand>
//             <Navbar.Brand href="/">
//                 ALA
//             </Navbar.Brand>
//             <hr />
//             <FaQuestionCircle style={{ "marginLeft": "5px" }} color="white" size="1.5em" />
//             <FaInfoCircle style={{ "marginLeft": "5px" }} color="white" size="1.5em" />
//         </Navbar>
//     </>
// );  
 
export default class NaviBar extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        }
    }
 
    handleModalOpen = () => {
        this.setState((prevState) => {
            return {
                modalOpen: !prevState.modalOpen
            }
        })
    }
 
    render() {
        return (
            <>
                <Navbar className="color-nav">
                    <Navbar.Brand href="/" className="ameri-logo">
                        <img alt="Ameri100" style={{ "width": "7rem", "marginBottom": "5px" }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Ameri100_logo.png/320px-Ameri100_logo.png"></img>
                    </Navbar.Brand>
                    {/* <Navbar.Brand href="/">
                        ALA
          </Navbar.Brand> */}
                    <hr />
                    <div className="upload-icon">
                    <FaQuestionCircle className="faq-icon" size="1.5em" cursor="pointer"/>
                    <FaInfoCircle className="fai-icon" size="1.5em" cursor="pointer" onClick={this.handleModalOpen} />
                    </div>
                </Navbar>
                <InfoModal
                    modalOpen={this.state.modalOpen}
                    handleModalOpen={this.handleModalOpen}
                    // handleModalLogout={this.logOut}
                />
            </>
        )
    }
 
}