import React, {useState, useEffect} from 'react';
import Slider, { Range } from 'rc-slider';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'rc-slider/assets/index.css';
import './App.css';

function App() {
  
  // useEffect(()=>{
  //   fetch("/motion").then(response => {
  //     const reader = response.body.getReader();
  //     return new ReadableStream({
  //       start(controller) {
  //         return pump();
  //         function pump() {
  //           return reader.read().then(({ done, value }) => {
  //             // When no more data needs to be consumed, close the stream
  //             if (done) {
  //                 controller.close();
  //                 return;
  //             }
  //             // Enqueue the next data chunk into our target stream
  //             controller.enqueue(value);
  //             return pump();
  //           });
  //         }
  //       }  
  //     })
  // })
  // .then(stream => new Response(stream, { headers: { "Content-Type": "multipart/x-mixed-replace; boundary=frame" } }))
  // .then(response => response.blob())
  // .then(blob => console.log(blob))
  // // .then(url => setPics([...pics, url]))
  // // .catch(err => console.error(err));
  // },[])

  const [resolution, setResolution] = useState({
    width: 0,
    height: 0
  })

  const [motionDetected, setMotionDetected] = useState(false)

  const [framerate, setFrameRate] = useState(0)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [sharpness, setSharpness] = useState(0)
  const [exposure, setExposure] = useState("")
  const [imageEffect, setImageEffect] = useState("")

  useEffect(()=>{
    fetch("/framerate").then(res=>res.json()).then(data=>setFrameRate(data.framerate))
  },[])

  useEffect(()=>{
    fetch("/brightness").then(res=>res.json()).then(data=>setBrightness(data.brightness)) 
  },[])

  useEffect(()=>{
    fetch("/contrast").then(res=>res.json()).then(data=>setContrast(data.contrast)) 
  },[])

  useEffect(()=>{
    fetch("/saturation").then(res=>res.json()).then(data=>setSaturation(data.saturation)) 
  },[])

  useEffect(()=>{
    fetch("/sharpness").then(res=>res.json()).then(data=>setSharpness(data.sharpness)) 
  },[])

  useEffect(()=>{
    fetch("/exposure").then(res=>res.json()).then(data=>setExposure(data.exposure)) 
  },[])

  useEffect(()=>{
    fetch("/effect").then(res=>res.json()).then(data=>setImageEffect(data.effect)) 
  },[])

  const [pics, setPics] = useState([])

  const handleCapture = ()=>{
    fetch("/capture").then(response => {
      const reader = response.body.getReader();
      return new ReadableStream({
        start(controller) {
          return pump();
          function pump() {
            return reader.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                  controller.close();
                  return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        }  
      })
  })
  .then(stream => new Response(stream, { headers: { "Content-Type": "multipart/x-mixed-replace; boundary=frame" } }))
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))
  .then(url => setPics([...pics, url]))
  .catch(err => console.error(err));
  }


  const handleRotate =()=>{
    fetch("/rotate")
  }

  const handleBrightness = (value)=>{
    setBrightness(value)
    fetch("/brightness",{
      method: "POST",
      body: JSON.stringify({brightness:value})
    })
  }

  const handleFrameChange = (value)=>{
    setFrameRate(value)
    fetch("/framerate",
    {
      method: "POST",
      body: JSON.stringify({framerate: value})
    }) 
  }

  const handleExposureChange = (value)=>{
    setExposure(value)
    fetch("/exposure",
    {
      method: "POST",
      body: JSON.stringify({exposure:value})
    }) 
  }


  const handleContrastChange = (value)=>{
    setContrast(value)
    fetch("/contrast",
    {
      method: "POST",
      body: JSON.stringify({contrast:value})
    }) 
  }

  const handleSaturationChange = (value)=>{
    setSaturation(value)
    fetch("/saturation",
    {
      method: "POST",
      body: JSON.stringify({saturation:value})
    }) 
  }

  const handleSharpnessChange = (value)=>{
    setSharpness(value)
    fetch("/sharpness",
    {
      method: "POST",
      body: JSON.stringify({sharpness:value})
    }) 
  }

  const handleImageEffectsChange = (value)=>{
    setImageEffect(value)
    fetch("/effect",
    {
      method: "POST",
      body: JSON.stringify({effect:value})
    }) 
  } 
  

  return (
    <Container>
      <Row>
        
      <Col>
        <h2>Controls</h2>
      <div>
        {/* <Button variant="outline-primary" onClick={()=>handleRotate()} type="button">Rotate (90°- right)</Button>
        <Button variant="outline-primary" type="button">Rotate (90°- left)</Button>  */}
        <div>
          {/* <Button type="Button" onClick={handleMotionDetection}>Monitor motion</Button> */}
          {/* <img src="/motion" alt="motion" /> */}
          {/* Motion detected: {motionDetected} */}
        </div>
          brightness: {brightness}
          <br />
          <Slider value={brightness} onChange={value=>handleBrightness(value)}/> 
        </div>
        <div>
          frame rate: {framerate}
          <br/>
          <Slider disabled value={framerate} onChange={value=>handleFrameChange(value)}/>  
        </div>
        <div>
          contrast: {contrast}
          <br/>
          <Slider value={contrast} onChange={value=>handleContrastChange(value)}/>
        </div>
        <div>
          saturation: {saturation}
          <br/>
          <Slider value={saturation} onChange={value=>handleSaturationChange(value)}/>
        </div>
        <div>
          sharpness: {sharpness}
          <br/>
          <Slider value={sharpness} onChange={value=>handleSharpnessChange(value)}/>
        </div>
        <div>
          exposure mode: {exposure}
          <br/>
          <Form.Control as="select" defaultValue="" value={exposure} onChange={e=>handleExposureChange(e.target.value)}>
            <option value="">Please select</option>
            <option value="off">off</option>
            <option value="auto">auto</option>
            <option value="night">night</option>
            <option value="nightpreview">nightpreview</option>
            <option value="backlight">backlight</option>
            <option value="spotlight">spotlight</option>
            <option value="sports">sports</option>
            <option value="snow">snow</option>
            <option value="beach">beach</option>
            <option value="verylong">verylong</option>
            <option value="fixedfps">fixedfps</option>
            <option value="antishake">antishake</option>
            <option value="fireworks">fireworks</option>
          </Form.Control>
        </div>
        <div>
          image effects: {imageEffect}
          <br/>
          <Form.Control as="select" defaultValue="" value={imageEffect} onChange={e=>handleImageEffectsChange(e.target.value)}>
            <option value="">Please select</option>
            <option value="none">none</option>
            <option value="negative">negative</option>
            <option value="solarize">solarize</option>
            <option value="sketch">sketch</option>
            <option value="denoise">denoise</option>
            <option value="emboss">emboss</option>
            <option value="oilpaint">oilpaint</option>
            <option value="hatch">hatch</option>
            <option value="gpen">gpen</option>
            <option value="pastel">pastel</option>
            <option value="watercolor">watercolor</option>
            <option value="film">film</option>
            <option value="blur">blur</option>
            <option value="saturation">saturation</option>
            <option value="colorswap">colorswap</option>
            <option value="washedout">washedout</option>
            <option value="posterise">posterise</option>
            <option value="colorpoint">colorpoint</option>
            <option value="colorbalance">colorbalance</option>
            <option value="cartoon">cartoon</option>
            <option value="deinterlace1">deinterlace1</option>
            <option value="deinterlace2">deinterlace2</option>
          </Form.Control>
        </div>
        
      </Col>
      <Col>
      {/* Video feed */}
      <div>
          <h2>Video feed</h2>
          <img src="/stream.mjpg" alt="feed"/>
        </div>
        {/* Image capture */}
        <Button variant="outline-primary" onClick={()=>handleCapture()} type="button">Capture</Button>
        <div>
          <h2>Image roll</h2>
          {pics.map((url, i)=>{
            return(
              <img  src={url} className="capture" alt="logo" />
            )}
          )}
      </div>
      </Col>
    </Row>
    </Container>

  );
}

export default App;
