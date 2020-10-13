import React,{Component} from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col,CustomInput } from 'reactstrap';
import FileBase64 from 'react-file-base64';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

export default class Example extends Component {
  state={
    vid_id:null,
    videoName:{
      value: ''
    },
    video:{
      value: null,
      display: null,
      invalid: false
    },
    image: {
      value: null,
      display: null,
      invalid: false
    },
    description: {
      value: '',
      display: null,
      invalid: false
    },
    categories:[],
    subCategories: [],
    features: [],
    views:[],
    category:'',
    subCategory:'',
    featured:'',
    view:'',
    addCategory: false,
    addSubategory: false,
    addFeatured: false,
    addView: false,
    catValue:null,
    subcatsValue:null,
    featureValue:[],
    viewValue:null
  }

  componentDidMount(){
    console.log("Props", this.props)

    if(this.props.location.state){

      this.setState({
        vid_id: this.props.location.state ? this.props.location.state.videoDetails.vid_id : null,
        videoName:{
          value: this.props.location.state ? this.props.location.state.videoDetails.vid_name : ''
        },
        description: {
          value: this.props.location.state ? this.props.location.state.videoDetails.vid_desc : '',
        },
        catValue: this.props.location.state ? this.props.location.state.videoDetails.cat_id : null,
        subcatsValue: this.props.location.state ? this.props.location.state.videoDetails.subcat_id : null,
        featureValue: this.props.location.state ? this.props.location.state.videoDetails.feature_id : [],
        viewValue: this.props.location.state ? this.props.location.state.videoDetails.view_id : null
      })

      if(this.props.location.state.editVideo){
        this.getFiles(this.props.location.state.videoDetails.vid_thumbs);    
        this.getVideos(this.props.location.state.videoDetails.vid_location);
      }
    }

    axios.get('/admin/fetch-allData')
    .then(res => {
      console.log("res data", res.data);
      if(res.data.data){
        if(res.data.cats.length !==0){
          this.setState({
            categories: res.data.cats
          })
        } else {
          this.setState({
            categories: []
          })
        }

        if(res.data.subcats.length !==0){
          this.setState({
            subCategories: res.data.subcats
          })
        } else {
          this.setState({
            subCategories: []
          })
        }

        if(res.data.feature.length !==0){
          this.setState({
            features: res.data.feature
          })
        } else {
          this.setState({
            features: []
          })
        }

        if(res.data.views.length !==0){
          this.setState({
            views: res.data.views
          })
        } else {
          this.setState({
            views: []
          })
        }
      } else{
        if(res.data.dbError){
          toast.error("Internal Error. Please try again",{
            position: toast.POSITION.BOTTOM_CENTER
          })
        }
      }
    })
    .catch(err => {
      toast.error("Connection Error. Please try again",{
        position: toast.POSITION.BOTTOM_CENTER
      })
    })
  }

  submitButtonHandler = () => {

    const formData = new FormData();
    if(this.state.videoName.value.trim() === ''){
      toast.warn("Please enter the video name", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } else if(this.state.description.value.trim() === ''){
      toast.warn("Please enter the video description", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } else if(this.state.catValue === null){
      toast.warn("Please select a category", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } else if(this.state.subcatsValue === null){
      toast.warn("Please select a subcategory", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } else if(this.state.image.value === null){
      toast.warn("Please select an image", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } else if(this.state.video.value === null){
      toast.warn("Please select a video", {
        position: toast.POSITION.BOTTOM_CENTER
      })
    } else {
      formData.append('image', this.state.image.value, [this.state.videoName.value +'^', this.state.description.value  +'^', this.state.catValue  +'^', this.state.subcatsValue  +'^', this.state.viewValue] );
      
      formData.append('video', this.state.video.value, [this.state.featureValue] );

      console.log('formData',formData);
      axios.post('/test-upload/thumbnails', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          },
      })
      .then(res => {
        if(res.data.data){
          toast.success("Video Successfully Inserted",{
            position: toast.POSITION.BOTTOM_CENTER
          })
          return window.location.reload()

        } else{
            if(res.data.dbError){
              toast.error("Internal Error. Please try again",{
                position: toast.POSITION.BOTTOM_CENTER
              })
            } else {
              toast.error("Something went wrong",{
                position: toast.POSITION.BOTTOM_CENTER
              })
            }
          }
        })
        .catch(err => {
          console.log("Error", err);
          toast.error("Connection Error. Please try again",{
            position: toast.POSITION.BOTTOM_CENTER
          })
        })
    }
  }

  getFiles(files){
    console.log("files",files);
    this.setState({
        ...this.state,
        image : {
            ...this.state.image,
            display: files[0].base64,
            value: files[0].file
        }
    })
  }

  getVideos(files){
    console.log("files",files);
    this.setState({
        ...this.state,
        video : {
            ...this.state.video,
            display: files[0].base64,
            value: files[0].file
        }
    })
  }

  videoNameHandler = (event) => {
    console.log("video name", event.target.value);
    this.setState({
      ...this.state,
      videoName: {
        ...this.state.videoName,
        value: event.target.value
      }
    })
  }

  videoDescription = (event) => {
    this.setState({
      description: {
        ...this.state.description,
        value: event.target.value,
      }
    })
  }

  onChangeCategory = (event) => {
    this.setState({
      category: event.target.value,
    })
  }

  onChangeSubcategory = (event) => {
    this.setState({
      subCategory: event.target.value,
    })
  }

  onChangeFeatured = (event) => {
    this.setState({
      featured: event.target.value,
    })
  }

  onChangeView = (event) => {
    this.setState({
      view: event.target.value,
    })
  }

  onClickCategory = () => {

    let body = {
      cat: this.state.category
    }
    console.log("Body", body);
    axios.post('/add/category', body)
    .then(res => {
      console.log("Res", res.data);
      if(res.data.data){
        this.setState({addCategory: false, category:''})
        toast.success("Category Created Successfully",{
          position: toast.POSITION.BOTTOM_CENTER
        })
        return this.componentDidMount();
      } else{
        if(res.data.dbError){
          toast.error("Internal Error. Please try again",{
            position: toast.POSITION.BOTTOM_CENTER
          })
        }
      }
    })
    .catch(err => {
      console.log("Error", err);
      toast.error("Connection Error. Please try again",{
        position: toast.POSITION.BOTTOM_CENTER
      })
    })

  }

  onClickSubcategory = () => {
    let body = {
      subCat: this.state.subCategory
    }

    axios.post('/add/subcategory', body)
    .then(res => {
      console.log("Res", res.data);
      if(res.data.data){
        this.setState({addSubategory: false, subCategory:''})
        toast.success("Subcategory Created Successfully",{
          position: toast.POSITION.BOTTOM_CENTER
        })
        return this.componentDidMount();
      } else{
        if(res.data.dbError){
          toast.error("Internal Error. Please try again",{
            position: toast.POSITION.BOTTOM_CENTER
          })
        }
      }
    })
    .catch(err => {
      console.log("Error", err);
      toast.error("Connection Error. Please try again",{
        position: toast.POSITION.BOTTOM_CENTER
      })
    })
    
  // }
}

  onClickFeatured = () => {
    let body = {
      featured: this.state.featured
    }

    axios.post('/add/featured', body)
    .then(res => {
      console.log("Res", res.data);
      if(res.data.data){
        this.setState({addFeatured: false, featured:''})
        toast.success("Category Created Successfully",{
          position: toast.POSITION.BOTTOM_CENTER
        })
        return this.componentDidMount();
      } else{
        if(res.data.dbError){
          toast.error("Internal Error. Please try again",{
            position: toast.POSITION.BOTTOM_CENTER
          })
        }
      }
    })
    .catch(err => {
      console.log("Error", err);
      toast.error("Connection Error. Please try again",{
        position: toast.POSITION.BOTTOM_CENTER
      })
    })
    
  }

  onClickView = () => {
    let body = {
      view: this.state.view
    }

    axios.post('/add/view', body)
    .then(res => {
      console.log("Res", res.data);
      if(res.data.data){
        this.setState({addView: false, view:''})
        toast.success("Category Created Successfully",{
          position: toast.POSITION.BOTTOM_CENTER
        })
        return this.componentDidMount();
      } else{
        if(res.data.dbError){
          toast.error("Internal Error. Please try again",{
            position: toast.POSITION.BOTTOM_CENTER
          })
        }
      }
    })
    .catch(err => {
      console.log("Error", err);
      toast.error("Connection Error. Please try again",{
        position: toast.POSITION.BOTTOM_CENTER
      })
    })    
  }

  videoCategoryInput =  (id) => {
    console.log("Id", id)
    this.setState({
      ...this.state,
      catValue:id
    })
  }

  videoSubcategoryInput = (id) => {
    console.log("Id", id)
    this.setState({
      ...this.state,
      subcatsValue:id
    })
  }


  videoFeatureInput = (id) => {
    let values=[];

    values.push(id);
    if(values.length !== 0){
    this.setState({
      ...this.state,
      featureValue:values
    })
  }else{
    this.setState({
      ...this.state,
      featureValue:[]
    })
  }
  }

  videoViewInput = (id) => {
    console.log("Id", id)
    this.setState({
      ...this.state,
      viewValue:id
    })
  }

  render() {
    console.log("State", this.state);

    let categoryData = null;
    if(this.state.categories.length !== 0){
      categoryData = this.state.categories.map((item) => {
        return <CustomInput type="checkbox" id={item.cat_name} label={item.cat_name} inline onClick={() => this.videoCategoryInput(item.cat_id)}/>
      })
    }

    let subcatsData = null;
    if(this.state.subCategories.length !== 0){
      subcatsData = this.state.subCategories.map((item) => {
        return <CustomInput type="checkbox" id={item.subcat_name} label={item.subcat_name} inline onClick={() => this.videoSubcategoryInput(item.subcat_id)}/>
      })
    }

    let featureData = null;
    if(this.state.features.length !== 0){
      featureData = this.state.features.map((item) => {
        return <CustomInput type="checkbox" id={item.feature_name} label={item.feature_name} inline onClick={() => this.videoFeatureInput(item.feature_id)}/>
      })
    }

    let viewData = null;
    if(this.state.views.length !== 0){
      viewData = this.state.views.map((item) => {
        return <CustomInput type="checkbox" id={'view'+item.view_name} label={item.view_name} inline onClick={() => this.videoViewInput(item.view_id)}/>
      })
    }


    return (
      <Container style={{padding:25, marginLeft:'8%', marginRight:'8%', width:'85%', marginTop:'1%'}}>
        <Form>
          <Row>
              <Col sm='6'>
                <FormGroup>
                  <Label for="videoname" style={{padding:5}}>Video Name</Label>
                  <Input type="text" name="videoname" id="name" placeholder="Type a Name" style={{padding:5}} value={this.state.videoName.value} onChange={(event) => this.videoNameHandler(event)}/>
                </FormGroup>
              </Col>
              <Col sm='6'>
                <FormGroup>
                  <Label for="videodesc" style={{padding:5}}>Description</Label>
                  <Input type="textarea" name="videodesc" id="desc" placeholder="Description" style={{padding:5}} value={this.state.description.value} onChange={(event) => this.videoDescription(event)}/>
                </FormGroup>
              </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup  style={{padding:20, border:'5px solid #f7f7f7'}}>
                <div style={{display:'inline-flex'}}>
                  <Label for="exampleCheckbox">Categories</Label>{' '}
                  <Button outline color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={() => this.setState({addCategory: !this.state.addCategory})}>Add New</Button>{' '}

                  {this.state.addCategory ? <Input type='text' style={{padding:5, width:300, marginLeft:20}} onChange={this.onChangeCategory}/> : null}
                  {this.state.addCategory ? <Button color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={this.onClickCategory}>Add</Button> : null}
                </div>

                <div>
                  {categoryData}                                  
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup style={{padding:20, border:'5px solid #f7f7f7'}}>
              <div style={{display:'inline-flex'}}>
                <Label for="exampleCheckbox">Sub-Categories</Label>
                <Button outline color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={() => this.setState({addSubategory: !this.state.addSubategory})}>Add New</Button>{' '}

                  {this.state.addSubategory ? <Input type='text' style={{padding:5, width:300, marginLeft:20}} onChange={this.onChangeSubcategory}/> : null}
                  {this.state.addSubategory ? <Button color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={this.onClickSubcategory}>Add</Button> : null}
                </div>
                <div>
                  {subcatsData}
                  {/* <CustomInput type="checkbox" id="Romantic" label="Romantic" inline onClick={this.videoRomanticSubcategory}/>
                  <CustomInput type="checkbox" id="Horror" label="Horror" inline onClick={this.videoHorrorSubcategory}/>
                  <CustomInput type="checkbox" id="Comedy" label="Comedy" inline onClick={this.videoComedySubcategory}/>
                  <CustomInput type="checkbox" id="ActionAdventure" label="Action & Adventure" inline onClick={this.videoActionAdventureSubcategory}/>
                  <CustomInput type="checkbox" id="Adult" label="Adult" inline onClick={this.videoAdultSubcategory}/> */}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup style={{padding:20, border:'5px solid #f7f7f7'}}>
              <div style={{display:'inline-flex'}}>
                <Label for="exampleCheckbox">Add to Home Screen [Featured]</Label>
                <Button outline color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={() => this.setState({addFeatured: !this.state.addFeatured})}>Add New</Button>{' '}

                  {this.state.addFeatured ? <Input type='text' style={{padding:5, width:300, marginLeft:20}} onChange={this.onChangeFeatured}/> : null}
                  {this.state.addFeatured ? <Button color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={this.onClickFeatured}>Add</Button> : null}
                </div>
                <div>
                  {featureData}
                  {/* <CustomInput type="checkbox" id="FeaturedCarousal" label="Carousal" inline onClick={this.screenCarousalFeatured}/>
                  <CustomInput type="checkbox" id="FeaturedRecommended" label="Recommended" inline onClick={this.screenRecommendedFeatured}/>
                  <CustomInput type="checkbox" id="FeaturedTrending" label="Trending" inline onClick={this.screenTrendingFeatured}/>
                  <CustomInput type="checkbox" id="FeaturedMostViewed" label="Most Viewed" inline onClick={this.screenMostViewedFeatured}/>
                  <CustomInput type="checkbox" id="FeaturedRecentlyAdded" label="Recently Added" inline onClick={this.screenRecentlyAddedFeatured}/> */}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup style={{padding:20, border:'5px solid #f7f7f7'}}>
              <div style={{display:'inline-flex'}}>
                <Label for="exampleCheckbox">View</Label>
                <Button outline color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={() => this.setState({addView: !this.state.addView})}>Add New</Button>{' '}

                  {this.state.addView ? <Input type='text' style={{padding:5, width:300, marginLeft:20}} onChange={this.onChangeView}/> : null}
                  {this.state.addView ? <Button color="info" style={{height:35, fontSize:13, marginLeft:10, marginBottom:10 }} onClick={this.onClickView}>Add</Button> : null}
                </div>
                <div>
                  {viewData}
                  {/* <CustomInput type="checkbox" id="ViewRecommended" label="Recommended" inline onClick={this.screenRecommendedView}/>
                  <CustomInput type="checkbox" id="ViewTrending" label="Trending" inline onClick={this.screenTrendingView}/>
                  <CustomInput type="checkbox" id="ViewMostViewed" label="Most Viewed" inline onClick={this.screenMostViewedView}/>
                  <CustomInput type="checkbox" id="ViewRecentlyAdded" label="Recently Added" inline onClick={this.screenRecentlyAddedView}/> */}
                  {/* <CustomInput type="checkbox" id="exampleCustom4" label="Adult" inline /> */}
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <FormGroup style={{padding:20, border:'5px solid #f7f7f7'}}>
                <Row>
                  <Col sm='6' style={{padding:20, borderRight:'2px solid #f7f7f7'}}>
                    <FormGroup>
                      <Label for="Thumbnails">Thumbnails</Label> <br />
                      {/* <Input type="file" name="Thumbnails" id="Thumbnails" onChange={(event) => this.thumbUploadHandler(event)}/>           */}
                      <FileBase64
                            multiple={ true }
                            onDone={ this.getFiles.bind(this) }
                        />
                    </FormGroup>
                  </Col>
                  <Col sm='6' style={{padding:20, borderLeft:'2px solid #f7f7f7'}}>
                    <FormGroup>
                      <Label for="Video">Video</Label> <br />
                      {/* <Input type="file" name="Video" id="Video" />           */}
                      <FileBase64
                            multiple={ true }
                            onDone={ this.getVideos.bind(this) }
                        />
                    </FormGroup>
                  </Col>
                </Row>      
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={{size:1, offset:5}}>
                <Button color='primary' style={{alignSelf:'center'}} onClick={this.submitButtonHandler}>Submit</Button>
            </Col>
          </Row>
          
        </Form>
        <ToastContainer />
      </Container>
    );
  }
}