import { Observable } from '@nativescript/core'

export class HomeViewModel extends Observable {

  public fullExample: string;
  public example: string;
  public numb: string;
  public stack: Array<Object>;

  constructor() {
    super()

    this.example = "";
    this.numb = "";
    this.stack = []
    this.fullExample = "";
    this.addStack(null, this.example, 0)
  }

  public setExample(value: any) {
    this.set("example", value)
  }

  public setFullExample(value: any) {
    this.set("fullExample", value)
  }

  public addStack(operation: string|null, value: string, priority: number) {
    this.stack.push(
      {
        "operation": operation,
        "value": value,
        "priority": priority
      }
    )
  }

  public addNumber(value: any) {
    this.numb = this.numb + value.object.text
    this.setFullExample(this.fullExample + value.object.text)
    this.setExample(this.example + value.object.text)
    this.stack[this.stack.length - 1]['value'] = this.numb
  }

  public addDot(){
    if(this.checkRules() && this.lastValue().indexOf('.') == -1 && this.lastValue().length != 0){
      this.setFullExample(this.fullExample + '.')
      this.setExample(this.example + ".")
      this.numb += '.'
      this.stack[this.stack.length - 1]['value'] += '.'
    }
  }

  public add() {
    if(this.checkRules() && this.lastValue().length != 0) {
      if(this.lastPriority() >= 0 && this.stack.length > 1) {
        this.result()
        this.setFullExample(this.fullExample + '+')
        this.setExample("")
        this.set("numb", "")
        this.addStack("+", "", 0)
      }
      else {
        this.setFullExample(this.fullExample + '+')
        this.setExample("")
        this.set("numb", "")
        this.addStack("+", "", 0)
      }
    }
  }

  public minus() {
    if(this.checkRules() && this.lastValue().length != 0) {
      if(this.lastPriority() >= 0 && this.stack.length > 1) {
        this.result()
        this.setFullExample(this.fullExample + '-')
        this.setExample("")
        this.set("numb", "")
        this.addStack("-", "", 0)
      }
      else {
        this.setFullExample(this.fullExample + '-')
        this.setExample("")
        this.set("numb", "")
        this.addStack("-", "", 0)
      }
    }
  }

  public myltiply () {
    if(this.checkRules() && this.lastValue().length != 0) {
      if(this.lastPriority() >= 1 && this.stack.length > 1) {
        this.result()
        this.setFullExample(this.fullExample + '*')
        this.setExample("")
        this.set("numb", "")
        this.addStack("*", "", 1)
      }
      else {
        this.setFullExample(this.fullExample + '*')
        this.setExample("")
        this.set("numb", "")
        this.addStack("*", "", 1)
      }
    }
  }

  public divide() {
    if(this.checkRules() && this.lastValue().length != 0) {
      if(this.lastPriority() >= 1 && this.stack.length > 1) {
        this.result()
        this.setFullExample(this.fullExample + '/')
        this.setExample("")
        this.set("numb", "")
        this.addStack("/", "", 1)
      }
      else {
        this.setFullExample(this.fullExample + '/')
        this.setExample("")
        this.set("numb", "")
        this.addStack("/", "", 1)
      }
    }
  }

  public pow() {
    if(this.checkRules() && this.lastValue().length != 0) {
      if(this.lastPriority() == 2 && this.stack.length > 1) {
        this.result()
        this.setFullExample(this.fullExample + '^')
        this.setExample("")
        this.set("numb", "")
        this.addStack("**", "", 2)
      }
      else {
        this.setFullExample(this.fullExample + '^')
        this.setExample("")
        this.set("numb", "")
        this.addStack("**", "", 2)
      }
    }
  }

  public percent(){
    if(this.checkRules()) {
      this.result()
      this.addStack("/", "100", 1)
      this.result()
      this.setFullExample(this.example)
    }
  }

  public removeLast() {
    if(this.checkRules()){
      this.setExample(this.example.slice(0, -1))
      this.setFullExample(this.fullExample.slice(0, -1))
      if(this.lastValue() === "" && this.stack.length != 1){
        this.stack.pop()
        // alert(this.lastValue())
        this.numb = this.lastValue()
        // this.setFullExample(this.fullExample.slice(0, -1))
      }
      else {
        // alert(this.numb)
        this.numb = this.numb.slice(0, -1)
        this.stack[this.stack.length - 1]['value'] = this.numb
      }
    }
  }

  private checkRules(): boolean {
    if(this.example.length != 0) {
      return true
    }
    else {
      return false
    }
  }

  private checkWarning() {
    if(isNaN(this.lastValue()) || this.lastValue()==Infinity){
      alert({
        "title": "Ошибка",
        "message": "Ошибка деления на ноль",
        "okButtonText": "Понятно"
      })
      this.clear()
    }
  }

  private lastPriority() {
    if (this.stack.length != 0) {
      return this.stack[this.stack.length - 1]['priority'];
    }
    else {
      return null;
    }
  }

  private lastValue() {
    if (this.stack.length != 0) {
      return this.stack[this.stack.length - 1]['value'];
    }
    else {
      return null;
    }
  }

  public equal() {
    if(this.checkRules && this.lastValue().length != 0){
      this.result()
      this.numb =  this.stack[this.stack.length - 1]['value']
      this.setFullExample("")
    }
  }

  private result() {
    if(this.checkRules() && this.stack.length != 1) {
      let last = this.stack.pop()
      let result = eval( this.stack[this.stack.length - 1]['value'] + last['operation']+ last['value'] )
      // alert(last['value'] + last['operation'] + this.stack[this.stack.length - 1]['value'])
      this.setExample(String(result))
      this.stack[this.stack.length - 1]['value'] = String(result)
      if(this.stack.length >=2 && last['priority'] <= 2){
        this.result()
      }
      this.checkWarning()
    }
  }

  public clear() {
    this.setExample("")
    this.stack = []
    this.addStack(null, "", 0)
    this.numb = ""
    this.setFullExample("")
  }

}
