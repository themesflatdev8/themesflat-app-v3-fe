import { useRouter } from "next/router";
import { Text } from "@shopify/polaris";
import { Modal, Image } from "@/components/core";
import welcomeImage from "~/images/welcome.png";
import { StyledModalContent } from "./styled-components";
import _routes from "@/constants/routes";

type Props = {
  open: boolean;
  onClose: Function;
};

const ModalWelcome = ({ open, onClose }: Props) => {
  const router = useRouter();
  return (
    <Modal
      open={open}
      closable={false}
      className=""
      onClose={() => onClose()}
      title="Welcome to M-Sell"
      footerAlign="center"
      primaryAction={{
        content: "Explore now",
        onAction: () => onClose(),
      }}
    >
      <StyledModalContent>
        <Image
          root={true}
          style={{ objectFit: "cover", objectPosition: "center" }}
          src={welcomeImage.src}
          width="278"
          height="120"
          alt=""
        ></Image>
        <Text as="p" variant="bodyMd">
          You are on the right track! <br></br>
          Keep going and explore new features.
        </Text>
      </StyledModalContent>
    </Modal>
  );
};

export default ModalWelcome;
