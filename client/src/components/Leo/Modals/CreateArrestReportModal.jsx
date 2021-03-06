import React, { Component } from 'react';
import { createArrestReport } from '../../../actions/recordActions';
import { setMessage } from '../../../actions/messageActions';
import ErrorMessage from '../../Partials/Messages/ErrorMessage';
import { connect } from 'react-redux';

class CreateArrestReportModal extends Component {
  constructor() {
    super();

    this.state = {
      arresteeName: '',
      charges: '',
      officerName: '',
      notes: '',
      postal: '',
      penalCodes: [],
      error: '',
    };
  }
  onSubmit = (e) => {
    e.preventDefault();

    const data = {
      arresteeName: this.state.arresteeName,
      officer_name: this.state.officerName,
      postal: this.state.postal,
      notes: this.state.notes,
      charges: this.state.charges,
    };
    document.getElementById('closeCreateArrestReport').click();
    this.props.createArrestReport(data);
    this.props.setMessage(
      'Successfully created arrest report, Target name: ' +
        this.state.arresteeName
    );

    this.setState({
      arresteeName: '',
      officerName: '',
      postal: '',
      notes: '',
      charges: '',
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.setState({
      penalCodes: this.props.penalCodes,
    });
  }

  render() {
    const {
      arresteeName,
      charges,
      officerName,
      notes,
      postal,
      penalCodes,
      error,
    } = this.state;
    return (
      <div
        className='modal fade'
        id='createArrestReport'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='createTicketModal'
        aria-hidden='true'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content bg-dark border-dark text-light'>
            <div className='modal-header'>
              <h5 className='modal-title' id='createTicketModal'>
                Create Arrest Report
              </h5>
              <button
                type='button'
                className='close text-light'
                data-dismiss='modal'
                id='closeCreateArrestReport'
                aria-label='Close'>
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <form onSubmit={this.onSubmit}>
              <div className='modal-body'>
                {error ? <ErrorMessage message={error} /> : null}
                <div className='form-group'>
                  <label htmlFor='arresteeName'>Enter Arrestee Name</label>
                  <input
                    className='form-control bg-secondary border-secondary text-light'
                    type='text'
                    name='arresteeName'
                    id='arresteeName'
                    value={arresteeName}
                    onChange={this.onChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='officerName'>Enter Officer Name</label>
                  <input
                    className='form-control bg-secondary border-secondary text-light'
                    type='text'
                    name='officerName'
                    id='officerName'
                    value={officerName}
                    onChange={this.onChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='charges'>Charges</label>
                  <input
                    className='form-control bg-secondary border-secondary text-light'
                    type='text'
                    name='charges'
                    id='charges'
                    value={charges}
                    onChange={this.onChange}
                    list='penalCodes'
                  />
                  <datalist id='penalCodes'>
                    {penalCodes.map((code, index) => {
                      return (
                        <option key={index} value={code.title}>
                          {code.title}
                        </option>
                      );
                    })}
                  </datalist>
                </div>
                <div className='form-group'>
                  <label htmlFor='postal'>Nearest Postal</label>
                  <input
                    className='form-control bg-secondary border-secondary text-light'
                    type='text'
                    name='postal'
                    id='postal'
                    value={postal}
                    onChange={this.onChange}
                  />
                </div>
                <div className='form-group'>
                  <label htmlFor='notes'>Notes</label>
                  <textarea
                    rows='5'
                    className='form-control bg-secondary border-secondary text-light'
                    type='text'
                    name='notes'
                    id='notes'
                    value={notes}
                    onChange={this.onChange}></textarea>
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'>
                  Cancel
                </button>
                <button type='submit' className='btn btn-primary'>
                  Create Arrest Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { createArrestReport, setMessage })(
  CreateArrestReportModal
);
