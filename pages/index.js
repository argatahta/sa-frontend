import { useEffect, useState } from "react";
import Head from 'next/head'
import { Button, Icon } from 'semantic-ui-react';
import { SemanticToastContainer, toast } from 'react-semantic-toasts';

import ModalForm from "../components/ModalForm";
import DetailBar from "../components/DetailBar";
import Ruler from "../components/Ruler";

import styles from '../styles/Home.module.css';
import ShiftsAPI from "../api/shifts";

import moment from "moment";

function insert(str, index, value) {
  return str.substr(0, index) + value + str.substr(index);
}

export default function Home() {
  const [isShowModal, setIsShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [formValue, setFormValue] = useState({});
  const [currentDate, setCurrentDate] = useState(moment())
  const [forTriggerUpdate, setForTriggerUpdate] = useState(false)

  const errorAlert = (message) => {
    toast({ 
      size:"tiny",
      type: 'error',
      // icon: 'exclamation circle',
      title: 'Error',
      description: message,
      animation: 'fade',
      time: 5000
  });
  }

  const successAlert = (message) => {
    toast({ 
      size:"tiny",
      type: 'success',
      // icon: 'exclamation circle',
      title: 'Success!',
      description: message,
      animation: 'fade',
      time: 5000
  });
  }

  useEffect(async () => {
   getShifts()
  }, [])

  const onButtonAddClick = () => {
    setIsEdit(false);
    setIsShowModal(true);
  }

  const handleOnAccept = (el) => {
    console.log(moment(el.startTime).format("HHmm"),parseInt(moment(el.startTime).format("HHmm")) )
    const payload = {
      ...el,
      date: moment(el.date).format("MM/DD/YYYY"),
      startTime: moment(el.startTime).format("HHmm"),
      endTime: moment(el.endTime).format("HHmm")
    }
    if(isEdit) {
      console.log('here')
      payload.id = formValue.id
      updateShift(payload)
      return
    }
    createShift(payload)
  }

  const handleRemove = () => {
    const payload = {id: formValue.id};
    deleteShift(payload)
  }

  const createShift = async (payload) => {
    try {
      const created = await ShiftsAPI.createShift(payload)
      console.log({created})
      if(created.data) {
        successAlert("A shift have successfully created")
        getShifts()
      }
    } catch (error) {
      if(error.err_msg) {
        errorAlert(error.err_msg)
        return
      }
      errorAlert("Server Error")
      console.log({error})
    }
  }

  const getShifts = async () => {
    try {
      const result = await ShiftsAPI.getShift()
      setShifts(result.data)
    } catch (error) {
      if(error.err_msg) {
        errorAlert(error.err_msg)
        return
      }
      errorAlert("Server Error")      
      console.log({error})
    }
  }

  const updateShift = async (payload) => {
    try {
      const updated = await ShiftsAPI.updateShift(payload)
      console.log({updated})
      if(updated.data) {
        successAlert("A shift have successfully updated")
        getShifts()
      }
    } catch (error) {
      if(error.err_msg) {
        errorAlert(error.err_msg)
        return
      }
      errorAlert("Server Error")      
      console.log({error})
    }
  }

  const deleteShift = async (payload) => {
    try {
      await ShiftsAPI.deleteShift(payload)
      successAlert("A shift have successfully removed")
      getShifts()
    } catch (error) {
      if(error.err_msg) {
        errorAlert(error.err_msg)
        return
      }
      errorAlert("Server Error")      
      console.log({error})
    }
  }

  const onDetailBarClick = (el) => {
    setIsEdit(true)
    setFormValue(el)
    setIsShowModal(true);
  }

  const handleNextDate = () => {
    setCurrentDate(currentDate.add(1, 'day'))
    setForTriggerUpdate(!forTriggerUpdate)
  }

  const handlePrevDate = () => {
    setCurrentDate(currentDate.subtract(1, 'day'))
    setForTriggerUpdate(!forTriggerUpdate)
  }
  return (
    <div className={styles.container}>
      <SemanticToastContainer />
      <ModalForm
        isEdit={isEdit}
        initialValue={formValue}
        isOpen={isShowModal}
        handleRemove={handleRemove}
        handleAccept={handleOnAccept}
        handleClose={() => {
          setIsShowModal(false)
          setFormValue({})
        }}
      />
      <Head>
        <title>Scheduler</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div style={{ marginBottom: "1rem" }}>
          <Button inverted color="green" size="tiny" onClick={onButtonAddClick}>
            <Icon name='plus' />
        Add Shift
        </Button>
        </div>

        <div style={{ display: "flex", flexDirection: "row", marginBottom: "2rem", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
          <div onClick={handlePrevDate} style={{ cursor: "pointer" }}>
            <Icon name='chevron left' />
          </div>


          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontWeight: "bold", letterSpacing: "0.5rem" }}>{currentDate.format("dddd")}</p>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <p style={{ fontSize: "3rem", marginRight: "0.5rem", fontWeight: "bold" }}>{currentDate.format("DD")}</p>
              <p style={{ fontSize: "1.5rem", marginRight: "0.5rem", fontWeight: "bold" }}>{currentDate.format("MMM, YYYY")}</p>
            </div>
          </div>
          <div onClick={handleNextDate} style={{ cursor: "pointer" }}>
            <Icon name='chevron right' />
          </div>

        </div>

        <div style={{ marginBottom: "1rem", position: "relative" }}>
          {shifts && shifts.length > 0 && shifts.map((el) => {
            const topPosition = (el.startTime / 10) + "rem";
            const heightBar = Math.abs(el.startTime - el.endTime) / 10 + "rem";
            const isCurrentDate = currentDate.isSame(new Date(el.date), "day")

            if (!isCurrentDate) {
              return
            }
            return (
              <div className="detail-bar-container" style={{ top: topPosition }}>
                <DetailBar
                  onClick={() => onDetailBarClick(el)}
                  height={heightBar}
                  name={el.name}
                  date={el.date}
                  startTime={insert(el.startTime.toString(), 2, ':')}
                  endTime={insert(el.endTime.toString(), 2, ':')}
                />
              </div>
            )
          })}
          <Ruler />
        </div>

      </main>

      <footer className={styles.footer}>
        Made with ❤️ by Arga Tahta
      </footer>
    </div>
  )
}
