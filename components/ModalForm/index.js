import { Button, Header, Image, Modal, Form, Icon } from 'semantic-ui-react'
import TimePicker from 'rc-time-picker';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { useEffect, useState } from 'react';

const formControlsDefault = {
    name: {
        value: '',
        label: 'Shift Name',
        placeholder: 'eg: Morning Shift',
        valid: false,
        touched: false,
        error: ''
    },
    date: {
        value: '',
        label: 'Pick Date',
        valid: false,
        touched: false,
        error: ''
    },
    startTime: {
        value: '',
        label: 'Start Time',
        valid: false,
        touched: false,
        error: ''
    },
    endTime: {
        value: '',
        label: 'End Time',
        valid: false,
        touched: false,
        error: ''
    },
}

function ErrorForm(props) {
    if (props.error) {
        return (
            <div class="ui pointing below prompt label" id="form-input-control-error-email-error-message" role="alert" aria-atomic="true">{props.error}</div>
        )
    }
    return(<div/>)

}

export default function ModalForm(props) {
    const [isFormValid, setIsFormValid] = useState(false);
    const [formControls, setFormControls] = useState({ ...formControlsDefault })

    useEffect(() => {
        if (props.isEdit && props.isOpen) {
            const updatedControls = {
                ...formControls,
            }

            updatedControls.name = { ...updatedControls.name, value: props.initialValue?.name ?? "", touched: true, valid: true }
            updatedControls.date = { ...updatedControls.date, value: new Date(props.initialValue?.date) ?? "", touched: true, valid: true };
            updatedControls.startTime = { ...updatedControls.startTime, value: moment(props.initialValue?.startTime, "HHmm") ?? "", touched: true, valid: true };
            updatedControls.endTime = { ...updatedControls.endTime, value: moment(props.initialValue?.endTime, "HHmm") ?? "", touched: true, valid: true };
            console.log(props)
            setIsFormValid(true);
            setFormControls(updatedControls);
        }
    }, [props.isOpen, props.isEdit])

    const handleOnClose = () => {
        if (props.handleClose) {
            props.handleClose();
            setFormControls({ ...formControlsDefault })
            setIsFormValid(false)
        }
    }

    const handleOnAccept = () => {
        const formData = {}
        for (let formElementId in formControls) {
            if (formControls[formElementId].value) {
                formData[formElementId] = formControls[formElementId].value
            }
        }
        if (props.handleAccept) {
            props.handleAccept(formData)
        }
        handleOnClose()
    };

    const handleOnRemove = () => {
        if (props.handleRemove) {
            props.handleRemove()
        }
        handleOnClose()
    };

    const validate = (name, value) => {
        let valid = {
            isValid: true,
            errorMessage: '',
        }
        switch (name) {
            case 'name':
                if (!value) {
                    valid.errorMessage = 'Please input shift name'
                }
                break;
            case 'date':
                if (!value) {
                    valid.errorMessage = 'Please input date'
                }
                break
            case 'startTime':
                if (!value) {
                    valid.errorMessage = 'Please input start time'
                }
                if (moment(value).isSameOrAfter(formControls.endTime.value)) {
                    valid.errorMessage = 'Start time should less than end time'
                }
                break
            case 'endTime':
                if (!value) {
                    valid.errorMessage = 'Please input end time'
                }
                if (moment(value).isSameOrBefore(formControls.startTime.value)) {
                    valid.errorMessage = 'End time should more than start time'
                }
                break
            default:
                valid.isValid = true
        }

        valid.isValid = valid.errorMessage ? false : true
        return valid
    }

    const changeHandler = event => {
        let name = ''
        let value = ''
        if (event.target) {
            name = event.target.name
            value = event.target.value
        }

        const updatedControls = {
            ...formControls,
        }

        const updatedFormElement = {
            ...updatedControls[name],
        }

        updatedFormElement.value = value
        updatedFormElement.touched = true

        let valid = validate(name, updatedFormElement.value)

        updatedFormElement.valid = valid.isValid
        updatedFormElement.error = valid.errorMessage
        updatedControls[name] = updatedFormElement

        let isFormValid = true
        for (let inputIdentifier in updatedControls) {
            isFormValid = updatedControls[inputIdentifier].valid && isFormValid
        }

        setFormControls(updatedControls)
        setIsFormValid(isFormValid)
    }

    console.log({ isFormValid, formControls })
    return (
        <div>
            <Modal
                size="mini"
                onClose={handleOnClose}
                open={props.isOpen}
            >
                <Modal.Header>Shift Form</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field error={formControls.name.error} required>
                                <label>{formControls.name.label}</label>
                                <ErrorForm error={formControls.name.error} />
                                <input onChange={changeHandler} name="name" value={formControls.name.value} placeholder={formControls.name.placeholder} />
                            </Form.Field>
                            <Form.Field error={formControls.date.error} required>
                                <label>{formControls.date.label}</label>
                                <ErrorForm error={formControls.date.error} />

                                <DatePicker
                                placeholderText="MM/DD/YYYY"
                                    minDate={new Date()}
                                    className="mf-date-picker"
                                    selected={formControls.date.value}
                                    onChange={(el) => changeHandler({
                                        target: {
                                            name: 'date',
                                            value: el
                                        }
                                    })}
                                />

                            </Form.Field>
                            <Form.Field error={formControls.startTime.error} required>
                                <label>{formControls.startTime.label}</label>
                                <ErrorForm error={formControls.startTime.error} />

                                <TimePicker
                                    name="startTime"
                                    placeholder="00:00"
                                    onChange={(el) => changeHandler({
                                        target: {
                                            name: 'startTime',
                                            value: el
                                        }
                                    })}
                                    showSecond={false}
                                    value={formControls.startTime.value} />
                            </Form.Field>
                            <Form.Field error={formControls.endTime.error} required>
                                <label>{formControls.endTime.label}</label>
                                <ErrorForm error={formControls.endTime.error} />
                                <TimePicker
                                    name="endTime"
                                    placeholder="23:59"
                                    onChange={(el) => changeHandler({
                                        target: {
                                            name: 'endTime',
                                            value: el
                                        }
                                    })}
                                    showSecond={false}
                                    value={formControls.endTime.value} />
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                </Modal.Content>

                <Modal.Actions>
                    {props.isEdit && (
                        <Button onClick={handleOnRemove} className="button-trash-modalform" size="tiny" color="red" icon>
                            <Icon name='trash' />
                        </Button>
                    )}
                    <Button size="tiny" color='black' onClick={handleOnClose}>
                        Cancel
                    </Button>
                    <Button
                        size="tiny"
                        disabled={!isFormValid}
                        content={props.isEdit ? "Update" : "Add"}
                        onClick={handleOnAccept}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </div>
    )
}