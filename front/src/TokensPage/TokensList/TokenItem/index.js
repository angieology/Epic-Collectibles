import React from "react";
import PropTypes from "prop-types";
import { Modal, useModal, ModalTransition } from "react-simple-hook-modal";

import TokenView from "../TokenView";
// import ContractContext from '../../Store';
import TokenImage from "../../../components/TokenImage";
import "react-simple-hook-modal/dist/styles.css";

import "./TokenItem.css";

const TokenItem = ({ token }) => {
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
      <div className="TokenItem">
        <div className="TokenItem-background_style">
          <TokenImage outer={gradient.outer} inner={gradient.inner} />
        </div>
        <div className="TokenItem-label">{`${gradient.outer} – ${gradient.outer}`}</div>
        <button onClick={openModal}>view details</button>
      </div>
    </>
  );
};

TokenItem.propTypes = {
  token: PropTypes.object,
};

export default TokenItem;
