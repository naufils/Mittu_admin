import React,{Component} from 'react';

import UploadForm from './uploadForm';
import {Route, BrowserRouter} from 'react-router-dom';
import NavBar from  './Navbar';
import AllVideos from './AllVideos';

class HomeScreen extends Component{
    render(){
        return(
            <div style={{alignItems:'center'}}>
                <NavBar />
                {/* <UploadForm /> */}
                <BrowserRouter>
                    <Route exact path='/' component={AllVideos} />
                    <Route exact path='/admin/upload' component={UploadForm} />
                </BrowserRouter>

            </div>
        )
    }
}

export default HomeScreen;
