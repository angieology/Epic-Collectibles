import React from "react";
import PropTypes from "prop-types";
import { Modal, useModal, ModalTransition } from "react-simple-hook-modal";
import "react-simple-hook-modal/dist/styles.css";
import PetsIcon from "@material-ui/icons/Pets";
import LoyaltyIcon from "@material-ui/icons/Loyalty";

import TokenView from "../TokenView";
import useTokenStatus from "../../../utils/useTokenStatus";
import TokenImage from "../../../components/TokenImage";

import "./TokenItem.css";

const TokenItem = ({ token }) => {
  const [isOwned, isOnSale] = useTokenStatus(token.index);

  const { isModalOpen, openModal, closeModal } = useModal();
  const gradient = token.gradient;

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
      <div className="TokenItem" onClick={openModal}>
        <div className="TokenItem-background_style" onClick={openModal}>
          <TokenImage outer={gradient.outer} inner={gradient.inner} />

          <div className="TokenItem-details">
            <span className="TokenItem-details_icons">
              {isOnSale && <LoyaltyIcon />}
              {isOwned && <PetsIcon />}
            </span>
            <span className="TokenItem-details_info">
              <div className="TokenItem-label">
                Token ID: <span className="bold-highlight">{token.index}</span>{" "}
              </div>

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
