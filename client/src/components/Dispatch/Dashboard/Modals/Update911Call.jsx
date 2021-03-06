import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  end911Call,
  get911Calls,
  update911Call,
} from '../../../../actions/911CallsActions';

class Update911Call extends Component {
  constructor() {
    super();

    this.state = {
      callLocation: '',
      callDescription: '',
      assignedUnits: [],
      activeOfficers: [],
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.setState({
      callLocation: this.props.callLocation,
      callDescription: this.props.callDescription,
      activeOfficers: this.props.activeOfficers,
    });
  }

  handleSelect = (e) => {
    this.setState({
      assignedUnits: [...this.state.assignedUnits, e.target.value],
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const data = {
      callId: this.props.id,
      callLocation: this.state.callLocation,
      callDescription: this.state.callDescription,
      assignedUnits: this.state.assignedUnits,
    };

    this.props.update911Call(data);

    document.getElementById('closeUpdate911Call' + this.props.id).click();
  };

  cancelCall = () => {
    this.props.end911Call(this.props.id);

    document.getElementById('closeUpdate911Call' + this.props.id).click();
  };

  render() {
    const { id, activeOfficers } = this.props;
    const { callLocation, callDescription } = this.state;
    return (
      <td
        className='modal fade'
        id={'update911Call' + id}
        tabIndex='-1'
        role='dialog'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content bg-dark border-dark text-light'>
            <div className='modal-header'>
              <h5 className='modal-title' id='exampleModalLabel'>
                Update 911 Call
              </h5>
              <button
                type='button'
                className='close text-light'
                data-dismiss='modal'
                id={'closeUpdate911Call' + id}
                aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className='modal-body'>
                <div className='form-group'>
                  <label htmlFor='status'>Location</label>
                  <input
                    name='callLocation'
                    id='callLocation'
                    value={callLocation}
                    className='form-control bg-secondary border-secondary text-light'
                    onChange={this.onChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='callDescription'>Description</label>
                  <input
                    name='callDescription'
                    id='callDescription'
                    value={callDescription}
                    className='form-control bg-secondary border-secondary text-light'
                    onChange={this.onChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='status'>Assigned Units</label>
                  {!activeOfficers[0] ? (
                    <p>There are no officers active</p>
                  ) : (
                    activeOfficers.map((officer, index) => {
                      return (
                        <div key={index} className='form-group'>
                          <input
                            type='checkbox'
                            name='assigned_unit'
                            className='form-control-input'
                            value={officer.officer_name}
                            onClick={this.handleSelect}
                          />
                          <label className=''>{officer.officer_name}</label>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary w-50'
                  data-dismiss='modal'>
                  Cancel
                </button>
                <button
                  onClick={this.cancelCall}
                  type='button'
                  className='btn btn-danger'>
                  End 911 Call
                </button>
                <button type='submit' className='btn btn-primary'>
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      </td>
    );
  }
}

export default connect(null, { end911Call, get911Calls, update911Call })(
  Update911Call
);
