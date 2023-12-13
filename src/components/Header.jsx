import './Header.css';

const Header = () => {
    return (
      <>
        <header>
          <img src={process.env.PUBLIC_URL + '/mdrd_logo.png'} alt="mdrd_logo" />
        </header>
      </>
      );
}

export default Header;