import { useRouter } from "next/router";

const useTrans = () => {
  const { locale } = useRouter();
  const trans = "vi";

  // const trans = locale === 'vi' ? vi : en

  return trans;
};

export default useTrans;
