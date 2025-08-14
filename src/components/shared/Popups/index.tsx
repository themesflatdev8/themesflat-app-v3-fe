import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ModalWelcome from "@/components/shared/ModalWelcome";
import ModalAffiliate from "@/components/shared/ModalAffiliate";
// import ModalAliExpress from '@/components/shared/ModalAliExpress'
import ModalUpgraded from "@/components/shared/ModalUpgraded";
import ModalDowngraded from "@/components/shared/ModalDowngraded";
import _routes from "@/constants/routes";
import {
  STORAGE_WELCOME,
  STORAGE_AFFILIATE,
  STORAGE_ALIEXPRESS,
  STORAGE_UPGRADE_PLAN,
  STORAGE_DOWNGRADE_PLAN,
} from "@/constants/storage";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "@/utils/storage";
import { useAuthContext } from "@/features/auth/contexts";
import qs from "qs";
import { isEmpty } from "@/utils/lodash";

type Props = {};

let timerAffiliate: any = null;
let timerAliexpress: any = null;

const Popups = ({}: Props) => {
  const router = useRouter();
  const { route, query } = router;
  const [{ store }]: any = useAuthContext();
  const [modalWelcome, setModalWelcome] = useState(false);
  const [modalAffiliate, setModalAffiliate] = useState(false);
  // const [modalAliExpress, setModalAliExpress] = useState(false)
  const [modalUpgraded, setModalUpgraded] = useState({
    open: false,
    planName: "",
  });
  const [modalDowngraded, setModalDowngraded] = useState({
    open: false,
    planName: "",
  });

  const onCloseModalWelcome = () => {
    setLocalStorage(`${STORAGE_WELCOME}`, "ms");
    setModalWelcome(false);
    checkUpgrade();
  };

  const onCloseModalAffilate = () => {
    setLocalStorage(`${STORAGE_AFFILIATE}`, "ms", 60 * 24 * 15);
    setModalAffiliate(false);
    // showModalAliexpress()
  };

  // const onCloseModalAliExpress = () => {
  //   setLocalStorage(`${STORAGE_ALIEXPRESS}}`, "ms", 60 * 24 * 25)
  //   setModalAliExpress(false)
  // }

  const onCloseModalUpgrade = () => {
    setModalUpgraded((val: any) => {
      return {
        ...val,
        open: false,
        planName: "",
      };
    });
    checkDowngrade();
  };

  const onCloseModalDowngrade = () => {
    setModalDowngraded((val: any) => {
      return {
        ...val,
        open: false,
        planName: "",
      };
    });
    showModalAffiliate();
  };

  const checkAffiliate = async () => {
    let objAffiliate = getLocalStorage(`${STORAGE_AFFILIATE}`);
    if (!objAffiliate && route != _routes.HOME && route != _routes.CONTACT) {
      if (isEmpty(store.bl)) {
        setModalAffiliate(true);
      } else {
        onCloseModalAffilate();
      }
    } else {
      // showModalAliexpress()
    }
  };

  // const checkAliExpress = () => {
  //   let obj = getLocalStorage(`${STORAGE_ALIEXPRESS}`)
  //   if(!obj && route != _routes.HOME){
  //     if(isEmpty(store.bl)){
  //       setModalAliExpress(true)
  //     }else{
  //       onCloseModalAliExpress()
  //     }
  //   }
  // }

  const checkUpgrade = () => {
    let obj = getLocalStorage(`${STORAGE_UPGRADE_PLAN}`);
    if (
      query.hasOwnProperty("plan") &&
      query.hasOwnProperty("is_upgrade") &&
      query.is_upgrade == "true" &&
      !obj
    ) {
      setModalUpgraded((val: any) => {
        return {
          ...val,
          open: true,
          planName: query.plan || "",
        };
      });
      setLocalStorage(`${STORAGE_UPGRADE_PLAN}`, "ms", 60 * 2);
      let queryTemp = { ...query };
      queryTemp["plan"] && delete queryTemp["plan"];
      queryTemp["is_upgrade"] && delete queryTemp["is_upgrade"];
      let strQuery = qs.stringify({ ...queryTemp });
      history.replaceState(
        null,
        "",
        `${_routes.HOME}${strQuery ? `?${strQuery}` : ""}`
      );
    } else {
      removeLocalStorage(`${STORAGE_UPGRADE_PLAN}`);
      checkDowngrade();
    }
  };

  const checkDowngrade = () => {
    let obj = getLocalStorage(`${STORAGE_DOWNGRADE_PLAN}`);
    if (
      query.hasOwnProperty("plan") &&
      query.hasOwnProperty("is_upgrade") &&
      query.is_upgrade == "false" &&
      !obj
    ) {
      setModalDowngraded((val: any) => {
        return {
          ...val,
          open: true,
          planName: query.plan || "",
        };
      });
      setLocalStorage(`${STORAGE_DOWNGRADE_PLAN}`, "ms", 60 * 2);
      let queryTemp = { ...query };
      queryTemp["plan"] && delete queryTemp["plan"];
      queryTemp["is_upgrade"] && delete queryTemp["is_upgrade"];
      let strQuery = qs.stringify({ ...queryTemp });
      history.replaceState(
        null,
        "",
        `${_routes.HOME}${strQuery ? `?${strQuery}` : ""}`
      );
    } else {
      removeLocalStorage(`${STORAGE_DOWNGRADE_PLAN}`);
      showModalAffiliate();
    }
  };

  const showModalAffiliate = () => {
    timerAffiliate = setTimeout(() => {
      checkAffiliate();
    }, 15000);
  };

  // const showModalAliexpress = () => {
  //   timerAliexpress = setTimeout(() => {
  //     checkAliExpress()
  //   }, 30000)
  // }

  useEffect(() => {
    // if(!store) return
    // clearTimeout(timerAffiliate)
    // clearTimeout(timerAliexpress)
    // if(query.is_welcome == 'true' && route == _routes.HOME){
    //   setModalWelcome(true)
    //   let queryTemp = {...query}
    //   queryTemp["is_welcome"] && (delete queryTemp["is_welcome"])
    //   let strQuery = qs.stringify({...queryTemp})
    //   history.replaceState(null, '', `${_routes.HOME}${strQuery ? `?${strQuery}` : ""}`);
    // }else{
    //   checkUpgrade()
    //   // showModalAffiliate()
    // }
  }, [route, store]);

  return (
    <>
      <ModalWelcome
        open={modalWelcome}
        onClose={() => onCloseModalWelcome()}
      ></ModalWelcome>

      <ModalAffiliate
        open={modalAffiliate}
        onClose={() => onCloseModalAffilate()}
      ></ModalAffiliate>

      {/* <ModalAliExpress
        open={modalAliExpress}
        onClose={() => onCloseModalAliExpress()}
      ></ModalAliExpress> */}

      <ModalDowngraded
        open={modalDowngraded.open}
        planName={modalDowngraded.planName}
        onClose={() => onCloseModalDowngrade()}
      ></ModalDowngraded>

      <ModalUpgraded
        open={modalUpgraded.open}
        planName={modalUpgraded.planName}
        onClose={() => onCloseModalUpgrade()}
      ></ModalUpgraded>
    </>
  );
};

export default Popups;
