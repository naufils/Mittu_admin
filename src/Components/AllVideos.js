import React from 'react';
import {Container, Card, CardBody, CardText, CardImg, CardHeader, Row, Button, Col} from 'reactstrap';
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';


export default class AllVideos extends React.Component{
    state={
        videos:[],
        loading: false
    }

    componentDidMount(){
        this.setState({
            loading: true
        })
        axios.post('/admin/fetch/allVideos')
        .then((res) => {
            console.log("response", res.data)
            if(res.data.data){
                this.setState({
                    videos: res.data.result,
                    loading: false
                })

            } else {
                if(res.data.dbError){
                    this.setState({
                        videos: [],
                        loading: false
                    })
                    toast.error("Internal server error", {
                        position: toast.POSITION.BOTTOM_CENTER
                    })
                } else {

                    this.setState({
                        videos: [],
                        loading: false
                    })

                    toast.error("No Videos found!", {
                        position: toast.POSITION.BOTTOM_CENTER
                    })

                }
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({
                videos: [],
                loading: false
            })
            toast.error("Connection Error", {
                position: toast.POSITION.BOTTOM_CENTER
            })

        })
    }

    editHandler = (item) => {

        this.props.history.push({
            pathname:'/admin/upload',
            state:{
                videoDetails: item,
                editVideo: true
               } 
            });
    }

    deleteHandler = (id) => {
        axios.post('/admin/delete-video', {id})
        .then((res) => {
            if(res.data){
                toast.success("Video Deleted Successfully", {
                    position: toast.POSITION.BOTTOM_CENTER
                })

                return this.componentDidMount()
            } else {
                if(res.dbError){
                    toast.error("Internal Server Error", {
                        position: toast.POSITION.BOTTOM_CENTER
                    })
                } else {
                    toast.warn("Video not Deleted. Please try again!", {
                        position: toast.POSITION.BOTTOM_CENTER
                    })
                }
            }

        })
        .catch((err) =>{
            console.log(err);
            toast.error("Connection Error", {
                position: toast.POSITION.BOTTOM_CENTER
            })
        })
    }

    render(){

        let videos;
        if(this.state.videos.length !== 0){
            videos = this.state.videos.map((item) => {

                return (
                    <Col sm={{size:3}} style={{padding:10}}>
                    <Card>
                        <CardImg src={item.vid_thumbs} alt={item.vid_name} />
                        {/* <CardHeader>{item.vid_name}</CardHeader> */}
                        <CardBody>
                            <CardText>{item.vid_name}</CardText>
                            <Row>
                                <Col sm={{size:5}} style={{marginTop:10}}>
                                    <Button onClick={() => this.editHandler(item)} color="info">Edit</Button>
                                </Col>

                                <Col sm={{size:6}} style={{marginTop:10}}>
                                    <Button onClick={() => this.deleteHandler(item.vid_id)} color="danger">Delete</Button>
                                </Col>
                            </Row>                            
                        </CardBody>
                    </Card>
                    </Col>
                )
        })
    }

        return (
            <Container style={{padding:10, marginTop:'1%', textAlign:'center'}}>
                <Row>
                    {videos}
                </Row>
                <ToastContainer />
            </Container>
        )
    }
}