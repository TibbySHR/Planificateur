import React, { useContext } from "react";
import "./styles.scss";
import { CourseSelectionContext } from "../../store/contexts/courseSelectionContext";

const CreditInfoBox = (props: {
  type: string;
  credits: { min: number; max: number };
  blockId:string;
}) => {
  const { credits } = props;

  const getCreditText = () => {
    const { min, max } = credits;
    const isMinExist = min > -1;
    const isMaxExist = max > -1;

    if (!isMinExist && !isMaxExist) return "";

    if (min === max) return `${min} crédits`;

    if (isMinExist && isMaxExist) return `${min} à ${max} crédits`;

    if (!isMinExist && isMaxExist) return `0 à ${max} crédits`;

    if (isMinExist && !isMaxExist) return `minimum ${min} crédits`;

    return "";
  };

  const CScontext = useContext(CourseSelectionContext) ;


  const getSumCredit= (blocId:string) => {

    return CScontext.semesters.reduce((sum, s)=>{

      const innerSum:number = s.courses.reduce((innerSum,c)=>{
        if ( c.blockId && c.blockId === blocId){
          return innerSum + c.credits
        }else{
          return innerSum
        }
      },0)


      return sum + innerSum
    },0)
  }
  let SumCredit = getSumCredit(props.blockId)
  const myStyle = {
    color: SumCredit <= props.credits.max && SumCredit >= props.credits.min ? '#4b545e' : 'orange',
  };


  return !!getCreditText() ? (
    <div className="CreditInfoBox__info">
      <p className="CreditInfoBox__item">{props.type}</p>
      <p className="CreditInfoBox__item">
        <span style={myStyle}>{SumCredit}</span>
        &nbsp;/&nbsp;
        {getCreditText()}
        </p>
    </div>
  ) : null;
};

export default CreditInfoBox;
