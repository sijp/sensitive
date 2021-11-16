import React from "react";
import { connect } from "react-redux";
import { FormControlLabel, Switch, Tooltip } from "@material-ui/core";

import { professionalActions as actions } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopHouse } from "@fortawesome/free-solid-svg-icons";

function ProfessionalsRemoteSwitch({ showRemote, setShowRemote, className }) {
  return (
    <Tooltip
      title="הצגת נותני שירות מקוון - למשל דרך זום"
      arrow
      placement="right"
    >
      <FormControlLabel
        control={
          <Switch
            checked={showRemote}
            onChange={() => setShowRemote(!showRemote)}
            color="primary"
          />
        }
        label={
          <>
            <FontAwesomeIcon icon={faLaptopHouse} /> שירות מקוון{" "}
          </>
        }
        className={className}
      />
    </Tooltip>
  );
}

function mapStateToProps(state) {
  return {
    showRemote: state.professionals.showRemote
  };
}

export default connect(mapStateToProps, {
  setShowRemote: actions.setShowRemote
})(ProfessionalsRemoteSwitch);
