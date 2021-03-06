import React, { Component } from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import ErrorMessage from '../../../../Partials/Messages/ErrorMessage';

export default class EditCompany extends Component {
  constructor() {
    super();

    this.state = {
      current: [],
      whitelisted: '',
      business_address: '',
      business_name: '',
      error: '',
    };
  }

  getCurrentCompany = () => {
    Axios({
      url: this.props.backendUrl,
      method: 'POST',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    }).then((res) => {
      this.setState({
        business_address: res.data.company[0].business_address,
        business_name: res.data.company[0].business_name,
        whitelisted: res.data.company[0].whitelisted,
        current: res.data.company[0],
      });
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    Axios({
      url: this.props.backendUrl + '/edit',
      method: 'POST',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
      data: {
        whitelisted: this.state.whitelisted,
        business_address: this.state.business_address,
        business_name: this.state.business_name,
      },
    }).then((res) => {
      if (res.data.msg === 'Updated') {
        sessionStorage.setItem(
          'message',
          'Successfully Updated Company'
        );
        return (window.location = "/citizen");
      }

      this.setState({
        error: res.data.msg,
      });
    });
  };

  deleteCompany = () => {
    Axios({
      url: this.props.backendUrl,
      method: 'DELETE',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    }).then((res) => {
      if (res.data.msg === 'Deleted') {
        sessionStorage.setItem('message', 'Successfully Deleted Your Company');
        return (window.location = '/citizen');
      }
    });
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  componentDidMount() {
    this.getCurrentCompany();
  }

  render() {
    const { current, business_address, business_name, error } = this.state;
    return (
      <div>
        <form className='mt-2' onSubmit={this.onSubmit}>
          {error ? <ErrorMessage message={error} dismiss /> : null}
          <div className='form-group'>
            <label htmlFor='business_name'>Company Name</label>
            <input
              value={business_name}
              onChange={this.onChange}
              className='form-control bg-secondary border-secondary text-light'
              name='business_name'
              id='business_name'
            />
          </div>
          <div className='form-group'>
            <label htmlFor='whitelisted'>Company whitelisted</label>
            <select
              onChange={this.onChange}
              className='form-control bg-secondary border-secondary text-light'
              name='whitelisted'
              id='whitelisted'>
              <option value={current.whitelisted}>{current.whitelisted}</option>
              <option disabled>--------</option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='business_address'>Company Address</label>
            <input
              onChange={this.onChange}
              className='form-control bg-secondary border-secondary text-light'
              name='business_address'
              id='business_address'
              value={business_address}
            />
          </div>
          <div className='form-group float-right'>
            <button className='btn btn-primary' type='submit'>
              Update Company
            </button>
          </div>
        </form>

        <button
          type='button'
          className='btn btn-danger'
          data-toggle='modal'
          data-target='#deleteCompanyModal'>
          Delete Company
        </button>

        <div
          className='modal fade'
          id='deleteCompanyModal'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='deleteCompanyModal'
          aria-hidden='true'>
          <div className='modal-dialog'>
            <div className='modal-content bg-dark border-dark text-light'>
              <div className='modal-header'>
                <h5 className='modal-title' id='deleteCompanyModal'>
                  Delete Company "{current.business_name}"
                </h5>
                <button
                  type='button'
                  className='close text-light'
                  data-dismiss='modal'
                  aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                Are you sure you want to delete your company?
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'>
                  Cancel
                </button>
                <button
                  type='button'
                  onClick={this.deleteCompany}
                  className='btn btn-danger'>
                  Yes, Delete my company
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
