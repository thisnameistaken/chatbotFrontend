
import React, { useState } from "react";
import { Message } from "../App";

interface ActionButtonsProps {
  loading: boolean;
  editingId: number | null;
  sendMessage: () => void;
  saveEditedMessage: () => void;
  cancelEditing: () => void;
}

function ActionButtons(actionButtonsProps: ActionButtonsProps) {
  if(actionButtonsProps.loading) {
    return(<div className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin border-solid border-e-transparent"></div>)
  }
  else if(!actionButtonsProps.loading && (actionButtonsProps.editingId !== null)) {
    return(<>
      <button
        onClick={actionButtonsProps.saveEditedMessage}
        className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-600"
      >
        Save
      </button>
      <button
      onClick={actionButtonsProps.cancelEditing}
      className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600"
    >
      Cancel
    </button>
    </>)
  } 
  else {
    return(
      <button
        onClick={actionButtonsProps.sendMessage}
        className="bg-blue-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    )
  }
}

export default ActionButtons
