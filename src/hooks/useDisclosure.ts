import { useState } from "react";

interface UserDisclosureProps {
  defaultIsOpen?: boolean;
}

const useDisclosure = ({ defaultIsOpen = false }: UserDisclosureProps) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const onToggle = () => setIsOpen(!isOpen);

  return {
    isOpen,
    onClose,
    onOpen,
    onToggle,
  };
};

export default useDisclosure;
