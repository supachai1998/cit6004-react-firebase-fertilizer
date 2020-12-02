import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Jumbotron,
  Button,
  Table,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import moment from "moment";
import { config } from "./firebase/config";
import firebase from "firebase";
import Loading from "./component/Loading";

const App = () => {
  // init for query
  const [his_fertilizer, sethis_fertilizer] = useState([]);
  const [fertilizer, setfertilizer] = useState([]);
  const [plants, setplants] = useState([]);
  const [garden, setgarden] = useState([]);
  // init Modal
  const [edit_modal_fertilizer, setedit_modal_fertilizer] = useState(false);
  const [edit_modal_his_fertilizer, setedit_modal_his_fertilizer] = useState(
    false
  );
  const [modal_fertilizer, setmodal_fertilizer] = useState(false);
  const [modal_his_fertilizer, setmodal_his_fertilizer] = useState(false);
  // init state for input
  const [key_f, setkey_f] = useState("");
  const [key_his, setkey_his] = useState("");
  const [code_f, setcode_f] = useState("");
  const [name_f, setname_f] = useState("");
  const [code_plants, setcode_plants] = useState("");
  const [code_garden, setcode_garden] = useState("");
  const [n_f, setn_f] = useState("");
  const [p_f, setp_f] = useState("");
  const [k_f, setk_f] = useState("");
  const [status_f, setstatus_f] = useState("");
  const [status_his, setstatus_his] = useState("");
  const [date_his, setdate_his] = useState("");
  const [detail_his, setdetail_his] = useState("");
  // end init

  let _plant_name,
    _garden_code,
    _fertilizer_code,
    _fertilizer_name = null;
  useEffect(() => {
    !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
    // ดึงข้อมูลปุ๋ย

    const fetch_firebase = async () => {
      await firebase
        .database()
        .ref("fertilizer")
        .on("value", (snapshot) => {
          let newQuery = [];
          snapshot.forEach((data) => {
            const dataVal = data.val();
            newQuery.push({
              key: data.key,
              code: dataVal.code_f,
              name: dataVal.name_f,
              n: dataVal.n_f,
              p: dataVal.p_f,
              k: dataVal.k_f,
              status: dataVal.status,
            });
          });
          // console.log(newQuery)
          setfertilizer(newQuery);
        });
      await firebase
        .database()
        .ref("garden")
        .on("value", (snapshot) => {
          let newQuery = [];
          snapshot.forEach((data) => {
            const dataVal = data.val();
            newQuery.push({
              key: data.key,
              code: dataVal.code,
            });
          });
          // console.log(newQuery)
          setgarden(newQuery);
        });
      await firebase
        .database()
        .ref("plants")
        .on("value", (snapshot) => {
          let newQuery = [];
          snapshot.forEach((data) => {
            const dataVal = data.val();
            newQuery.push({
              key: data.key,
              name: dataVal.name_th,
            });
          });
          // console.log(newQuery)
          setplants(newQuery);
        });

      await firebase
        .database()
        .ref("fertilizer_history")
        .on("value", (snapshot) => {
          let newQuery = [];
          snapshot.forEach((data) => {
            const dataVal = data.val();
            let _plant_name = "";
            firebase
              .database()
              .ref(`plants`)
              .child(dataVal.code_plants)
              .once("value", (snapshot2) => {
                _plant_name = snapshot2.val().name_th;
              });
            let _fertilizer_code , _fertilizer_name ,_fertilizer_key = "";
            firebase
              .database()
              .ref(`fertilizer`)
              .child(dataVal.key_f)
              .once("value", (snapshot2) => {
                _fertilizer_key = snapshot2.key;
                _fertilizer_code = snapshot2.val().code_f;
                _fertilizer_name = snapshot2.val().name_f;
              });

            let _garden_code = "";
            firebase
              .database()
              .ref(`garden`)
              .child(dataVal.code_garden)
              .once("value", (snapshot2) => {
                _garden_code = snapshot2.val().code;
              });

            newQuery.push({
              key: data.key,
              key_f: _fertilizer_key,
              code_f: _fertilizer_code,
              name_f: _fertilizer_name,
              code_plants: dataVal.code_plants,
              name_plants: _plant_name,
              code_garden: dataVal.code_garden,
              name_garden: _garden_code,
              date: dataVal.date,
              detail: dataVal.detail_his,
              status: dataVal.status,
            });
          });
          // console.log(newQuery)
          sethis_fertilizer(newQuery);
        });
    };
    fetch_firebase();
  }, [_plant_name, _garden_code, _fertilizer_code, _fertilizer_name]);
  const handlesubmit_modal_fertilizer = (e) => {
    e.preventDefault();
    name_f && n_f && p_f && k_f ? insert_f() : console.log("error");
  };
  const handlesubmit_modal_his_fertilizer = (e) => {
    e.preventDefault();
    key_f && detail_his && date_his && code_plants && code_garden
      ? insert_h_f()
      : console.log(`error : ${key_f} , ${detail_his} , ${date_his} , ${code_plants} , ${code_garden} `);
  };
  const insert_f = () => {
    edit_modal_fertilizer
      ? firebase.database().ref("fertilizer").child(key_f).update({
          code_f: code_f,
          name_f: name_f,
          n_f: n_f,
          p_f: p_f,
          k_f: k_f,
          status: true,
        })
      : firebase.database().ref("fertilizer").push({
          code_f: code_f,
          name_f: name_f,
          n_f: n_f,
          p_f: p_f,
          k_f: k_f,
          status: true,
        });
    setedit_modal_fertilizer(false);
    setmodal_fertilizer(false);
    cls_f();
  };
  const insert_h_f = () => {
    edit_modal_his_fertilizer?
     firebase.database().ref("fertilizer_history").child(key_his).update({
          date: date_his,
          key_f: key_f,
          code_garden: code_garden,
          code_plants: code_plants,
          detail_his: detail_his,
          status: true,
        })
      : 
      firebase.database().ref("fertilizer_history").push({
          date: date_his,
          key_f: key_f,
          code_garden: code_garden,
          code_plants: code_plants,
          detail_his: detail_his,
          status: true,
        });
    setmodal_his_fertilizer(false);
    setedit_modal_his_fertilizer(false);
    cls_h();
  };
  const cls_f = () => {
    setcode_f("");
    setname_f("");
    setn_f("");
    setp_f("");
    setk_f("");
    setkey_f("");
  };
  const cls_h = () => {
    setkey_his("");
    setdate_his("");
    setdetail_his("");
    setcode_f("");
    setcode_plants("");
    setcode_garden("");
    setkey_f("")
  };
  const handleonhide_fertilizer = () => {
    setmodal_fertilizer(false);
    setedit_modal_fertilizer(false);
    cls_f();
  };
  const handleonhide_his_fertilizer = () => {
    setmodal_his_fertilizer(false);
    setedit_modal_his_fertilizer(false);
    cls_h();
  };
  return (
    <Jumbotron>
      {/* กรอกข้อมูลปุ๋ย */}
      <Modal
        show={modal_fertilizer}
        onHide={handleonhide_fertilizer}
        keyboard={false}
        onSubmit={handlesubmit_modal_fertilizer}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {edit_modal_fertilizer ? (
              <>แก้ไขข้อมูลปุ๋ย</>
            ) : (
              <>เพิ่มข้อมูลปุ๋ย</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>รหัสปุ๋ย</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="รหัสปุ๋ย"
                    defaultValue={code_f}
                    onChange={({ target: { value } }) => {
                      setcode_f(value);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>ชื่อปุ๋ย</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="ชื่อปุ๋ย"
                    defaultValue={name_f}
                    onChange={({ target: { value } }) => {
                      setname_f(value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>N</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="กรอกตัวเลข(N)"
                    defaultValue={n_f}
                    onChange={({ target: { value } }) => {
                      setn_f(value);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>P</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="กรอกตัวเลข(P)"
                    defaultValue={p_f}
                    onChange={({ target: { value } }) => {
                      setp_f(value);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>K</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="กรอกตัวเลข(K)"
                    defaultValue={k_f}
                    onChange={({ target: { value } }) => {
                      setk_f(value);
                    }}
                  />
                </Col>
              </Row>
            </Form.Group>
            <hr />
            {edit_modal_fertilizer ? (
              <Button className="btn-warning float-right" type="submit">
                แก้ไข
              </Button>
            ) : (
              <Button className="btn-success float-right" type="submit">
                เพิ่มข้อมูล
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      {/* กรอกประวัติการใส่ปุ๋ย */}
      <Modal
        show={modal_his_fertilizer}
        onHide={handleonhide_his_fertilizer}
        keyboard={false}
        onSubmit={handlesubmit_modal_his_fertilizer}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {edit_modal_his_fertilizer ? (
              <>แก้ไขข้อมูลประวัติ</>
            ) : (
              <>เพิ่มข้อมูลประวัติ</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Row>
                <Col>
                  <Form.Label>วันที่</Form.Label>
                  <Form.Control
                    type="date"
                    stype={{ format: "dd/mm/yyyy" }}
                    format="dd/mm/yyyy"
                    defaultValue={date_his}
                    onChange={({ target: { value } }) => {
                      setdate_his(value);
                    }}
                  />
                </Col>
                <Col>
                  <Form.Label>ชื่อปุ๋ย</Form.Label>
                  <Form.Control
                    as="select"
                    defaultValue={key_f}
                    onChange={({ target: { value } }) => {
                      setkey_f(value);
                    }}
                  >
                    {edit_modal_his_fertilizer ? (
                      <>
                        {fertilizer &&
                          fertilizer.map(({ key, name }) =>
                          key === key_f ? (
                              <>
                                <option selected key={key} value={key}>
                                  {name}
                                </option>
                              </>
                            ) : (
                              <>
                                <option key={key} value={key}>
                                  {name}
                                </option>
                              </>
                            )
                          )}
                      </>
                    ) : (
                      <>
                        <option>--เลือกชื่อปุ๋ย--</option>
                        {fertilizer &&
                          fertilizer.map(({ key, name }) => (
                            <option key={key} value={key}>
                              {name}
                            </option>
                          ))}
                      </>
                    )}
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group>
              <Form.Label>รหัสแปลงปลูก</Form.Label>
              <Form.Control
                as="select"
                defaultValue={code_garden}
                onChange={({ target: { value } }) => {
                  setcode_garden(value);
                }}
              >
                <option>--เลือกรหัสแปลงปลูก--</option>
                {garden &&
                  garden.map(({ key, code }) => (
                    <option key={key} value={key}>
                      {code}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>ชื่อพืช</Form.Label>
              <Form.Control
                as="select"
                defaultValue={code_plants}
                onChange={({ target: { value } }) => {
                  setcode_plants(value);
                }}
              >
                {edit_modal_his_fertilizer ? (
                  <>
                    {plants &&
                      plants.map(({ key, name }) =>
                      key === code_plants ? (
                          <option selected key={key} value={key}>
                            {name}
                          </option>
                        ) : (
                          <option key={key} value={key}>
                            {name}
                          </option>
                        )
                      )}
                  </>
                ) : (
                  <>
                    <option>--เลือกชื่อพืช--</option>
                    {plants &&
                      plants.map(({ key, name }) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                  </>
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>รายละเอียด</Form.Label>
              <Form.Control
                type="textarea"
                as="textarea"
                rows={3}
                defaultValue={detail_his}
                onChange={({ target: { value } }) => {
                  setdetail_his(value);
                }}
              />
            </Form.Group>
            <hr />
            {edit_modal_his_fertilizer ? <Button className="btn-warning float-right" type="submit">
              แก้ไขข้อมูลประวัติ
            </Button>:<Button className="btn-success float-right" type="submit">
              เพิ่มข้อมูลประวัติ
            </Button>}
            
          </Form>
        </Modal.Body>
      </Modal>

      <Button
        className="float-right btn-success"
        onClick={() => setmodal_fertilizer(true)}
      >
        เพิ่มปุ๋ย
      </Button>

      {!fertilizer ? (
        <Loading />
      ) : (
        <>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>รหัสปุ๋ย</th>
                <th>ชื่อปุ๋ย</th>
                <th>N</th>
                <th>P</th>
                <th>K</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {fertilizer.map((index) => (
                <>
                  {!index ? (
                    <Loading />
                  ) : (
                    <>
                      {index.status ? (
                        <tr key={index.key}>
                          <td>{index.code}</td>
                          <td>{index.name}</td>
                          <td>{index.n}</td>
                          <td>{index.p}</td>
                          <td>{index.k}</td>
                          <td>
                            <Button
                              className="btn-warning mr-2"
                              onClick={() => {
                                setkey_f(index.key);
                                setcode_f(index.code);
                                setname_f(index.name);
                                setn_f(index.n);
                                setp_f(index.p);
                                setk_f(index.k);
                                setmodal_fertilizer(true);
                                setedit_modal_fertilizer(true);
                              }}
                            >
                              edit
                            </Button>
                            <Button
                              className="btn-danger"
                              onClick={() => {
                                window.confirm(
                                  `คุณต้องการจะลบ ${index.code} หรือไม่ `
                                ) ? (
                                  firebase
                                    .database()
                                    .ref("/fertilizer")
                                    .child(index.key)
                                    .update({
                                      status: false,
                                    })
                                ) : (
                                  <></>
                                );
                              }}
                            >
                              delete
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              ))}
            </tbody>
          </Table>
          <hr />
        </>
      )}
      <Button
        className="float-right btn-success"
        onClick={() => setmodal_his_fertilizer(true)}
      >
        เพิ่มประวัติ
      </Button>
      {!his_fertilizer ? (
        <Loading />
      ) : (
        <>
          <Table striped bordered hover variant="white">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รหัสปุ๋ย</th>
                <th>ชื่อปุ๋ย</th>
                <th>ชื่อพืช</th>
                <th>หมายเหตุ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {his_fertilizer.map((index) => (
                <>
                  {!index ? (
                    <Loading />
                  ) : (
                    <>
                      {index.status ? (
                        <tr key={index.key}>
                          <td>{moment(index.date).format("DD-MM-YY")}</td>
                          <td>{index.code_f}</td>
                          <td>{index.name_f}</td>
                          <td>{index.name_plants}</td>
                          <td>{index.detail}</td>
                          <td>
                            <Button
                              className="btn-warning mr-2 "
                              onClick={() => {
                                setkey_his(index.key)
                                setkey_f(index.key_f)
                                setcode_f(index.code_f);
                                setdate_his(index.date);
                                setdetail_his(index.detail);
                                setcode_garden(index.code_garden);
                                setcode_plants(index.code_plants);
                                setedit_modal_his_fertilizer(true);
                                setmodal_his_fertilizer(true);
                              }}
                            >
                              edit
                            </Button>
                            {index.status ?<Button className="btn-danger"
                            onClick={() => {
                                window.confirm(
                                  `คุณต้องการจะลบ วันที่ ${index.date} รหัสปุ๋ย ${index.code_f} หรือไม่ `
                                ) ? (
                                  firebase
                                    .database()
                                    .ref("/fertilizer_history")
                                    .child(index.key)
                                    .update({
                                      status: false,
                                    })
                                ) : (
                                  <></>
                                );
                              }}
                            >delete</Button>
                            :
                            <Button className="btn-info"
                            onClick={() => {
                                  firebase
                                    .database()
                                    .ref("/fertilizer_history")
                                    .child(index.key)
                                    .update({
                                      status: true,
                                    })
                              }}
                            >delete</Button>
                             }
                            
                          </td>
                        </tr>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                </>
              ))}
            </tbody>
          </Table>
          <hr />
        </>
      )}
    </Jumbotron>
  );
};

export default App;
