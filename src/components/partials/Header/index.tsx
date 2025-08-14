import { Container } from "@/components/core";

type Props = {
  global?: any;
};

const Header = ({}: Props) => {
  return (
    <header className="fixed flex items-center top-0 left-0 right-0 z-20 text-gray-90 h-14 sm:h-18 bg-white">
      <Container>HEADER</Container>
    </header>
  );
};

Header.defaultProps = {};

export default Header;
