import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Button, Container, Form, Nav, Navbar, OverlayTrigger, Tooltip, NavDropdown, Offcanvas } from "react-bootstrap";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBillTrendUp } from "@fortawesome/free-solid-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);

import Logo from "../assets/logo.png";
import { mainSliceActions } from "../Store/MainSlice.js";
import { getSearchInputData } from "../actions.js";

import UserProfileModal from "./Auth/Modals/UserProfileModal.jsx";
import TechnicianRequestModal from "./Modals/TechnicianRequestModal.jsx";

import './Header.css'

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginStatus = useSelector((state) => state.mainSlice.loginStatus);
  const userData = useSelector((state) => state.mainSlice.userData);

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [productsSearchData, setProductSearchData] = useState([]);
  const [showTechnicianRequestModal, setShowTechnicianRequestModal] = useState(false);
  const showSearchOptions = useSelector((state) => state.mainSlice.showSearchOptions);
  const [mobileInfoTooltip, setmobileInfoTooltip] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [showSearchFeild, setShowSearchFeild] = useState(false)

  useEffect(() => {
    const getProductData = async () => {
      setProductSearchData(await getSearchInputData())
    }
    getProductData();

    // Function to update windowWidth state with current window width
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to resize event
    window.addEventListener('resize', updateWindowWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
      closeOffCanvas()
    };
  }, [])

  const handleBookATechieInfo = () => {
    setmobileInfoTooltip(true)
    setTimeout(() => {
      setmobileInfoTooltip(false)
    }, 5000)
  }

  //mobile functionality
  const closeOffCanvas = () => {
    if (windowWidth < 992) {
      const closeBtn = document.querySelector('.offcanvas-header')?.children;
      if (closeBtn?.length >= 1) closeBtn[1].click()
    }
  }

  const loginBtnClicked = () => {
    closeOffCanvas();
    navigate("/login", { replace: true });
  };

  const registerBtnClicked = () => {
    closeOffCanvas()
    navigate("/sign-up", { replace: true });
  };

  const logoutBtnClicked = () => {
    closeOffCanvas()
    dispatch(mainSliceActions.logoutUser());
    toast.success("Logout Successful");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  const myAdsBtnCLicked = () => {
    closeOffCanvas()
    if (loginStatus) {
      navigate("/my_ads");
    } else {
      navigate("/login");
    }
  };

  const profileBtnClicked = () => {
    closeOffCanvas()
    if (loginStatus) {
      setShowUserProfile(true)
    } else {
      navigate('/login')
    }
  }

  const showCartBtnClicked = () => {
    closeOffCanvas()
    if (loginStatus) {
      navigate('/show_cart')
    } else {
      navigate('/login')
    }
  }

  const handleSearchFromDrodown = async () => {
    closeOffCanvas()
    dispatch(mainSliceActions.showSearchOptions(false))
    navigate(`/search/${searchTerm}`)
  }

  const renderTooltip = (props) => <div>
    <h6>DoorStep Repair</h6>
    <p style={{ display: 'grid', gridTemplateColumns: '2fr 10fr', textAlign: 'left', padding: '5px' }}>
      <span>
        1.
      </span>
      <span>
        Book a Technician for only 150rs.
      </span>
      <span>2.</span>
      <span>All Brands Services Available.</span>
      <span>3.</span>
      <span>6 Months PLACART Warranty on the Service and Parts Replaced by PLACART Team.</span>
      <span>4.</span>
      <span>PC Building and Networking, All kind of set ups</span>
    </p>
  </div>

  const searchForm = () => <Form className="d-flex fs-6 mx-2" style={{ position: "relative", width: windowWidth > 992 && '60%', padding: windowWidth < 992 && '0.5rem 0rem' }}>
    <Form.Control
      style={{ width: "100%", borderRadius: '0px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}
      value={searchTerm.slice(0, 70)}
      type="search"
      placeholder="Search"
      aria-label="Search"
      onChange={(e) => { setSearchTerm(e.target.value), dispatch(mainSliceActions.showSearchOptions(true)) }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
          e.preventDefault();
          dispatch(mainSliceActions.showSearchOptions(false))
          navigate(`/search/${searchTerm}`)
        }
      }}
    />
    <button style={{
      fontSize: '18px',
      fontWeight: '600',
      ZIndex: '100',
      color: 'black',
      cursor: 'pointer',
      borderRadius: '0px 12px 12px 0px',
      background: 'white',
      border: 'none',
      width: '33px'
    }}
      className="d-flex justify-content-center align-items-center"
      onClick={(e) => { e.preventDefault(), setSearchTerm(''), setShowSearchFeild(false) }} >
      <FontAwesomeIcon icon="fa-solid fa-xmark" />
    </button>
    {productsSearchData && productsSearchData.length && searchTerm !== '' && showSearchOptions ?
      <div style={{ width: '99%', position: 'absolute', top: '40px', zIndex: '10', background: 'white', borderBottomLeftRadius: '5px', borderBottomRightRadius: '5px' }}>
        {productsSearchData.filter((product) => product.searchText.toLowerCase().includes(searchTerm.toLowerCase())).map(productData => {
          return <div onClick={() => handleSearchFromDrodown(productData)}
            style={{ background: '#E5E5E5', color: 'black', width: '99%', float: 'left', margin: '3px', padding: '5px', cursor: 'pointer' }}>{productData.productName.slice(0, 70) + `${productData.productName.length > 70 ? '...' : ''}`}</div>
        })}
      </div>
      : null}
  </Form>

  const bookATechnician = () => {
    return <div>
      <OverlayTrigger
        delay={{ hide: 100, show: 100 }}
        placement="bottom"
        overlay={(props) => <Tooltip {...props}>{renderTooltip()}</Tooltip>}
      >
        <Button style={{ display: 'flex', gap: '10px', alignItems: 'center' }} variant="dark" onClick={() => loginStatus ? setShowTechnicianRequestModal(true) : alert('Please Login')}>
          <FontAwesomeIcon icon={faScrewdriverWrench} />
          Book a Technician
        </Button>
      </OverlayTrigger>
    </div>
  }

  const handleShowBookATechieModal = () => {
    setShowTechnicianRequestModal(true);
    closeOffCanvas()
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            <img src={Logo} alt="plaCart-performace" height='50vh' onClick={() => navigate('/')} />
          </Navbar.Brand>
          <div className="search-icon-toggle" style={windowWidth > 992 ? { display: 'none' } : {}} onClick={() => setShowSearchFeild(!showSearchFeild)}><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="px-1 fs-5 text-light" /></div>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} className="navbar-toggle"><FontAwesomeIcon icon="fa-solid fa-bars" style={{ color: "#ffffff", }} /></Navbar.Toggle>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
            style={{ backgroundColor: '#252525' }}
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                <img src={Logo} alt="plaCart-performace" height='50vh' onClick={() => window.open('/', '_self')} />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {windowWidth < 992 ?
                // Mobile View
                <Nav>
                  <div className="mobile-view">
                    {loginStatus ? <>
                      <div className="nav-bar-item profile-btn">
                        <div>
                          <FontAwesomeIcon icon="fa-solid fa-user" className="px-2" />
                          <span>Hey, {userData && userData.name ? userData.name.slice(0, 9) : "User"}</span>
                        </div>
                        <div onClick={logoutBtnClicked}>
                          <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" style={{ color: "red" }} />
                        </div>
                      </div>
                      <div className="nav-bar-item" onClick={() => { closeOffCanvas(), navigate('/sell_your_product', { replace: true }) }}><FontAwesomeIcon icon={faMoneyBillTrendUp} className="px-3" />Sell your Product</div>
                      <div className="nav-bar-item" onClick={myAdsBtnCLicked}><FontAwesomeIcon icon="fas fa-ad" className="px-3" />My Ads</div>
                      <div className="nav-bar-item" onClick={() => { closeOffCanvas(), navigate('/your_orders') }}><FontAwesomeIcon icon="fa-solid fa-box-open" className="px-3" />Your Orders</div>
                      <div className="nav-bar-item" onClick={showCartBtnClicked}><FontAwesomeIcon icon="fa-solid fa-cart-shopping" className="px-3" />Shopping Cart</div>
                      <div className="nav-bar-item" onClick={() => { closeOffCanvas(), navigate('/show_wishlist') }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="px-3" />Wish List</div>
                      <div className="nav-bar-item" onClick={() => { closeOffCanvas(), navigate('/cancelled_returned') }}><FontAwesomeIcon icon="fa-solid fa-ban" className="px-3 text-danger" />Cancel/Return</div>
                      <div className="nav-bar-item" onClick={profileBtnClicked}><FontAwesomeIcon icon="fa-solid fa-gear" className="px-3" />Settings</div>
                    </> : <>
                      <div className="nav-bar-item" onClick={loginBtnClicked}><FontAwesomeIcon icon="fa-solid fa-right-to-bracket" className="px-3" />Login</div>
                      <div className="nav-bar-item" onClick={registerBtnClicked}><FontAwesomeIcon icon="fa-solid fa-user-plus" className="px-3" />Register</div>
                    </>}
                    <div className="nav-bar-item">
                      <span onClick={() => loginStatus ? handleShowBookATechieModal() : alert('Please Login')}>
                        <FontAwesomeIcon icon={faScrewdriverWrench} className="px-3" />Book a Technician
                      </span>
                      <div style={{ position: 'relative' }}>
                        {mobileInfoTooltip && <div className="custom-tooltip" style={loginStatus ? {} : { top: '30px' }}>{renderTooltip()}</div>}
                        <FontAwesomeIcon onClick={handleBookATechieInfo} icon="fa-solid fa-circle-info" className="px-3" />
                      </div>
                    </div>
                    <div className="nav-bar-item" onClick={() => { window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=yeshwanth.ch.naidu@gmail.com", "_blank") }}><FontAwesomeIcon icon="fa-solid fa-user-shield" className="px-3" />Customer Service</div>
                  </div>
                </Nav>
                // Mobile View End
                :
                <Nav className="align-items-center fs-5 flex-grow-1 pe-3 justify-content-evenly">
                  {/* Search Form start*/}
                  {searchForm()}
                  {/* Search Form end */}

                  {/* Book a Technician */}
                  {bookATechnician()}
                  {/* Book a Technician End */}

                  {/* User Data Start */}
                  {loginStatus ? <NavDropdown
                    title={<div className="text-light fs-6">{" "}<FontAwesomeIcon icon="fa-solid fa-user" className="ms-1 px-2" />{" "}
                      Hey, {userData && userData.name ? userData.name.slice(0, 9) : "User"}
                    </div>}
                    id={`offcanvasNavbarDropdown-expand-lg`}
                    className="user-dropdown"
                  >
                    <NavDropdown.Item onClick={() => navigate('/sell_your_product', { replace: true })}><FontAwesomeIcon icon={faMoneyBillTrendUp} className="px-2" />Sell your Product</NavDropdown.Item>
                    <NavDropdown.Item onClick={myAdsBtnCLicked}><FontAwesomeIcon icon="fas fa-ad" className="px-2" />My Ads</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/your_orders')}><FontAwesomeIcon icon="fa-solid fa-box-open" className="px-2" />Your Orders</NavDropdown.Item>
                    <NavDropdown.Item onClick={showCartBtnClicked}><FontAwesomeIcon icon="fa-solid fa-cart-shopping" className="px-2" />Shopping Cart</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => { navigate('/show_wishlist') }}><FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="px-2" />Wish List</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => { navigate('/cancelled_returned') }}><FontAwesomeIcon icon="fa-solid fa-ban" className="px-2 text-danger" />Cancel/Return</NavDropdown.Item>
                    <NavDropdown.Item onClick={profileBtnClicked}><FontAwesomeIcon icon="fa-solid fa-gear" className="px-2" />Settings</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => { window.open("https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=yeshwanth.ch.naidu@gmail.com", "_blank") }}><FontAwesomeIcon icon="fa-solid fa-user-shield" className="px-2" />Customer Service</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutBtnClicked}><FontAwesomeIcon icon="fa-solid fa-right-from-bracket" className="px-2 text-danger" />Logout</NavDropdown.Item>
                  </NavDropdown> :
                    // user Data End
                    // Login Register Buttons
                    <div className="fs-6" style={{ display: 'flex', justifyContent: 'space-between', color: 'white', gap: '2rem' }}>
                      <Nav.Link variant="outline-none" className="text-light" onClick={loginBtnClicked} >
                        <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" className="px-3" />
                        Login
                      </Nav.Link>
                      <Nav.Link variant="outline-none" className="text-light" onClick={registerBtnClicked}>
                        <FontAwesomeIcon icon="fa-solid fa-user-plus" className="px-3" />
                        Register
                      </Nav.Link >
                    </div>
                    // login register button ends
                  }
                </Nav>}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {showSearchFeild && windowWidth < 992 && searchForm()}
      {showUserProfile && <UserProfileModal setShowUserProfile={setShowUserProfile} />}
      {showTechnicianRequestModal && <TechnicianRequestModal setShowTechnicianRequestModal={setShowTechnicianRequestModal} />}
    </>
  );
}

export default Header;
