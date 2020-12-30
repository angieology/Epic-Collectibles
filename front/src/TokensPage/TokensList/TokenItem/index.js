import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Modal, useModal, ModalTransition } from "react-simple-hook-modal";

import TokenView from "../TokenView";
import ContractContext from "../../../Store";
import TokenImage from "../../../components/TokenImage";
import "react-simple-hook-modal/dist/styles.css";
import LoyaltyIcon from "@material-ui/icons/Loyalty";
import PetsIcon from "@material-ui/icons/Pets";
import "./TokenItem.css";

const TokenItem = ({ token }) => {
  const [state] = useContext(ContractContext);

  const { isModalOpen, openModal, closeModal } = useModal();
  const gradient = token.gradient;

  const [tokensOnSale, setTokensOnSale] = useState([]);
  const [ownerTokens, setOwnerTokens] = useState([]);

  useEffect(() => {
    if (state) {
      console.log({ state });
      setTokensOnSale(state.tokensOnSale);
      setOwnerTokens(state.ownerTokens);
    }
  }, [state]);

  const isOnSale = tokensOnSale && tokensOnSale.includes(token.index);
  const isOwned = ownerTokens && ownerTokens.includes(token.index);

  return (
    <>
      <Modal
        id={`token-item-modal-${token.index}`}
        isOpen={isModalOpen}
        transition={ModalTransition.BOTTOM_UP}
        onBackdropClick={closeModal}
      >
        <TokenView token={token} onCloseClicked={closeModal} />{" "}
      </Modal>
      <div className="TokenItem"  onClick={openModal}>
        <div className="TokenItem-background_style"  onClick={openModal}>
          <TokenImage outer={gradient.outer} inner={gradient.inner} />

          <div className="TokenItem-details">
            <span className="TokenItem-details_icons">
              {isOnSale && <LoyaltyIcon />}
              {isOwned && <PetsIcon />}
            </span>
            <span className="TokenItem-details_info">
              {/* <div className="TokenItem-label">{`${gradient.outer} – ${gradient.outer}`}</div> */}
              <button onClick={openModal}>view details</button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

TokenItem.propTypes = {
  token: PropTypes.object,
};

export default TokenItem;
