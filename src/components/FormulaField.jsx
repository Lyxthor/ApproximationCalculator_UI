import {memo, useContext, useReducer, createContext, useEffect, useCallback} from 'react'
const ExpContext = createContext("")
const SetExpContext = createContext(()=>{})
const calculatorApiBase = import.meta.env.VITE_API_URL

// let openedBracketCount = 0
// let closedBracketCount = 0

function ExpressionReducer(state, newExpression)
{
    if(newExpression==="") return ""
    const oldExpression = state
    const regex = /^[0-9+\-*/^()xab.]+$/;
    return regex.test(newExpression) ? newExpression : oldExpression
}
function InputSymbol(expression, setExpression, sym)
{
    const IsNonAtStartOperator = (_sym)=>["*", "/", "+", "^", "."].includes(_sym)
    const GetExpAt = id=>newExpression.at(id)

    const operatorsRegex = /^[+\-*/^]+$/
    const digitRegex = /[0-9]/
    const varsRegex = /[xab]/
    var newExpression = expression

    if(sym==="DEL")
    {
        newExpression = newExpression.length<=1?"":newExpression.slice(0,-1)
        setExpression(newExpression)
        console.log(newExpression)
        return
    }
    

    // MATH OPERATOR SYMBOLS VALIDATION : START
    if(operatorsRegex.test(sym))
    {
        if(expression==="") return
        if(GetExpAt(-1)===".") return
        if(operatorsRegex.test(GetExpAt(-1)))
        {
            if(GetExpAt(-2) === "(" && IsNonAtStartOperator(sym)) return
            else newExpression = newExpression.slice(0, newExpression.length-1)
        }
    }
    if(GetExpAt(-1) === "(" && IsNonAtStartOperator(sym)) return
    // MATH OPERATOR SYMBOLS VALIDATION : END

    // DOT VALIDATION : START
    if(sym === ".")
    {
        let lastChar = GetExpAt(-1)
        if(!digitRegex.test(lastChar) || CheckIsDotOccupied(expression)) return
    }
    // DOT VALIDATION : END
    if(varsRegex.test(sym))
    {
        let lastChar = GetExpAt(-1)
        if(lastChar===".") return
        if(lastChar===")") sym=`*${sym}`
        else if(digitRegex.test(lastChar) || varsRegex.test(lastChar)) sym = `*${sym}`
    }
    if(digitRegex.test(sym))
    {
        let lastChar = GetExpAt(-1)
        if(lastChar===")") sym=`*${sym}`
        else if(varsRegex.test(lastChar)) sym = `*${sym}`
    }
    if(GetExpAt(-1)==="0"&&GetExpAt(-2)!==0)
    {
        let charBeforeZero = GetExpAt(-2)
        if(!digitRegex.test(charBeforeZero)&&sym!=="."&&charBeforeZero!==".")
        {
            newExpression = newExpression.slice(0, newExpression.length-1)
        }
    }

    // ZERO SYMBOL VALIDATION
    

    // BRACKET VALIDATION START
    if(sym === "()")
    {
        var lastUsedBracket = ")"
        var lastCharOfExpression = expression.at(-1)
        if(lastCharOfExpression === ".") return

        for(const c of expression)
        {
            if(c === "(" || c === ")")
            {
                lastUsedBracket = c
            }
        }

        if(lastCharOfExpression===lastUsedBracket)
        {
            sym = lastUsedBracket
            if(sym===")")
            {
                sym = GetMaxCloseBrackets(expression) > 0 ? sym : "*("
            }
        }
        else 
        {
            if(lastUsedBracket === ")" || operatorsRegex.test(lastCharOfExpression))
            {
                sym = varsRegex.test(lastCharOfExpression) || digitRegex.test(lastCharOfExpression) ? "*(" : "("
            }
            else if(lastUsedBracket === "(")
            {
                sym = ")"
            }
        }
    }
    // BRACKET VALIDATION : END
    newExpression += sym
    setExpression(newExpression)
}
function GetMaxCloseBrackets(expression)
{
    const openedBracketRgx = /\(/g
    const closedBracketRgx = /\)/g
    const openedLength = (expression.match(openedBracketRgx) || []).length
    const closedLength = (expression.match(closedBracketRgx) || []).length
    return openedLength - closedLength
}
function CheckIsDotOccupied(expression)
{
    const operatorsRegex = /^[+\-*/^]+$/
    var operatorIndex = 0
    var dotIndex = 0
    var i = 0
    for(const c of expression)
    {
        if(c===".") dotIndex = i
        else if(operatorsRegex.test(c)) operatorIndex = i
        i++
    }
    return dotIndex > operatorIndex
}
function InputButton({sym})
{
    const expression = useContext(ExpContext)
    const setExpression = useContext(SetExpContext)

    return (
        <button 
        onClick={()=>InputSymbol(expression, setExpression, sym)}
        className='btn'
        >{sym}</button>
    )
}
function StopLabelReducer(state, label)
{
    let newLabel
    switch(label) {
        case "iteration" :
            newLabel = "n="
            break
        case "precision" :
            newLabel = "f(x)="
            break
        default :
            newLabel = state
            break
    }
    return newLabel
}

const FormulaField=memo(({setData})=>
{
    const [expression, setExpression] = useReducer(ExpressionReducer, "")
    const [stopLabel, setStopLabel] = useReducer(StopLabelReducer, "n=")
    useEffect(()=>{console.log("Formula Field Rendered")})
    const HandleSubmit = useCallback((event)=>
    {
        event.preventDefault()
        console.log(event.target)
        const formData = new FormData(event.target)
        const jsonBody = Object.fromEntries(formData.entries());
        
        fetch(`${calculatorApiBase}/bisection`,{
            mode: 'cors',
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(jsonBody)
        }).then(res=>{
            return res.json()
        }).then(result=>{
            console.log(result)
            setData(result.data)
        })
    }, [setData])
    
    return (
        <ExpContext.Provider value={expression}>
            <SetExpContext.Provider value={setExpression}>
                <div className="w-full">
                    <form onSubmit={HandleSubmit} className="w-full">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Initial limits</legend>
                            <div className='join'>
                                <label className="input join-item">
                                    <span>a=</span>
                                    <input type="number" name="a" id="" defaultValue={0} step={0.01}/>
                                </label>
                                <label className="input join-item">
                                    <span>b=</span>
                                    <input type="number" name="b" id="" defaultValue={1} step={0.01}/>
                                </label>
                            </div>
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Stop at</legend>
                            <div className='join'>
                                <label className="input join-item">
                                    <span>{stopLabel}</span>
                                    <input type="number" name="stop_value" id="" defaultValue={stopLabel==="n=" ? 1 : 0.001} step={0.0000000000001} />
                                </label>
                                <select 
                                name="stop_condition" 
                                id="" 
                                className='join-item select'
                                onChange={e=>setStopLabel(e.target.value)}>
                                    <option value="iteration">iteration</option>
                                    <option value="precision">precision</option>
                                </select>
                            </div>
                        </fieldset>
                        
                        <section id="formula-field w-full">
                            <fieldset className="fieldset w-full">
                                <legend className="fieldset-legend">Max Places</legend>
                                <input 
                                type="number" 
                                name="decimal_places" 
                                id="decimal_places" 
                                className='input w-full' 
                                defaultValue={4}/>
                            </fieldset>
                        </section>
                        <section id="formula-field">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Expression</legend>
                                <input 
                                type="text" 
                                name="expression" 
                                id="expression" 
                                value={expression} 
                                className='input w-full' 
                                readOnly/>
                            </fieldset>
                        </section>
                        <button type="submit" className='w-full btn'>Calculate</button>
                    </form>
                    <section id="symbol-input-btns" className='grid grid-cols-5'> 
                        <InputButton sym="+" />
                        <InputButton sym="-" />
                        <InputButton sym="/" />
                        <InputButton sym="*" />
                        <InputButton sym="^" />
                        <InputButton sym="." />
                        <InputButton sym="()" />
                        <InputButton sym="x" />
                        <InputButton sym="a" />
                        <InputButton sym="b" />
                        <InputButton sym="DEL" />
                    </section>

                    <section id="number-input-btns" className='grid grid-cols-5'>
                        <InputButton sym="0" />
                        <InputButton sym="1" />
                        <InputButton sym="2" />
                        <InputButton sym="3" />
                        <InputButton sym="4" />
                        <InputButton sym="5" />
                        <InputButton sym="6" />
                        <InputButton sym="7" />
                        <InputButton sym="8" />
                        <InputButton sym="9" />
                    </section>
                </div>
            </SetExpContext.Provider>
        </ExpContext.Provider>
        
    )
})

export default FormulaField