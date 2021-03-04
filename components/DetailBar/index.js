import { Card } from 'semantic-ui-react'

const heightValue = 5;

export default function DetailBar(props) {
    return (
        <div onClick={props.onClick} className="detail-bar" style={{height:props.height}}>
            <h3>{props.name}</h3>
                <p>Date: {props.date}</p>
                <p>Time: {props.startTime} - {props.endTime} </p>
        </div>
    )
}