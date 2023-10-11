const createtable = document.querySelector('#createtable');
const form = document.querySelector('#form')

const myModels = document.querySelector('#myModels')

const buttonDiv=document.querySelector('#buttondiv')

const showModelForm=document.querySelector('#showmodelform')

const headerRow=document.querySelector('#headerRow')

createtable.addEventListener('click', (e) => {
    form.innerHTML = `<h1> create Table</h1>
    <div>
    Tablename:<input type="text" id="tablename" name="tablename"> 
    </div>   
    <div id="fields">
    </div>
    <button  onClick="addfield(event)"> Add fields</button><br><br>
    <button type="submit">Create Table</button>
    `
})

function addfield(e) {
    e.preventDefault()
    const fields = document.querySelector('#fields')
    const fieldDiv = document.createElement('div')
    fieldDiv.innerHTML =  `
        Field name:<input type="text" class="fieldname" placeholder="name">
        Type: <input type="text" class="fieldtype" placeholder="type">
        
    `
    fields.appendChild(fieldDiv)
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tablename = document.querySelector('#tablename').value

    const fieldnameInputs = document.querySelectorAll('.fieldname')
    const fieldtypeInputs = document.querySelectorAll('.fieldtype')

    const fields = {}

    for (let i = 0; i < fieldnameInputs.length; i++) {
        const fieldname = fieldnameInputs[i].value
        const fieldtype = fieldtypeInputs[i].value
        fields[fieldname] = fieldtype
    }

    
    const insertFormData = {
        fieldNames: Object.keys(fields)
    };
    localStorage.setItem(tablename, JSON.stringify(insertFormData));

    axios.post('http://localhost:3000/create-table', { TableName: tablename, dynamicFields:fields }).then((res) => {
        form.innerHTML = " "
        getAllModels()
        
    });
});

window.addEventListener('DOMContentLoaded',()=>{
    getAllModels()

})

function getAllModels() {
    myModels.innerHTML = ""
        
    axios.get('http://localhost:3000/get-models').then((res) => {

        const definedModels = res.data

        myModels.innerHTML='<h2>TABLES</h2>'
        for (let model of definedModels) {  
            const div = document.createElement('div')
            div.innerHTML = `
                <button tablename="${model.modelName}" tablefields="${model.fields}" onClick="showTable(event)">${model.modelName}</button>
            `
            myModels.appendChild(div)
        }
    })
}

function showTable(e) {
    const fields = e.target.getAttribute('tablefields').split(',')
    const tableName = e.target.getAttribute('tablename')
    headerRow.innerHTML = ''

    buttonDiv.innerHTML = ''

    
    for(let fieldName of fields){
        const th=document.createElement('th')
        th.textContent=fieldName
        headerRow.appendChild(th)
    }

    displayRecords(tableName)

  buttonDiv.innerHTML=`
  <button  onClick="showInsertForm('${tableName}')">insert Record</button>
  ` 
   
}

function showInsertForm(tableName) {
    const data= JSON.parse(localStorage.getItem(tableName))
    const fieldNames=data.fieldNames

    const form = document.createElement('form')
    form.innerHTML = `<h2>Insert into ${tableName}</h2>`
    for (let i = 0; i < fieldNames.length; i++) {
        form.innerHTML += `
            <div>
                ${fieldNames[i]}: <input type="text" name="${fieldNames[i]}">
          </div>
        `
    }

    form.innerHTML += `<button type="submit">Insert</button>`
    showModelForm.appendChild(form)
    

    form.addEventListener('submit', (e) => {
        e.preventDefault()
      showModelForm.innerHTML=""
       const details = {}

        for (let i = 0; i < fieldNames.length; i++) {
            const fieldName = fieldNames[i]
            const inputField = form.querySelector(`[name="${fieldName}"]`)
            details[fieldName] = inputField.value
        }

        const data = {
            modelName: tableName, 
            details: details
        }
        axios.post('http://localhost:3000/insert-record', data).then((res)=>{
            form.innerHTML = ""
            displayRecords( tableName)

        })

        
    })
}
function displayRecords(tableName){
    const tbody = document.querySelector('#tableBody')
    tbody.innerHTML = ""

    axios.get(`http://localhost:3000/get-records?modelName=${tableName}`).then((res) => {
        const records = res.data
        console.log('records',records)     
        
        for (let record of records) {
            const row = document.createElement('tr')
            for (const key in record) {
                const td = document.createElement('td')
                td.textContent = record[key]
                row.appendChild(td)
            }
            
        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', () => deleteRecord(tableName, record.id))
        row.appendChild(deleteButton)
        tbody.appendChild(row)
        }
    }) 
}
function deleteRecord(tableName,id){
    axios.delete(`http://localhost:3000/delete-record/${id}?modelName=${tableName}`).then((res)=>{
        displayRecords(tableName)

    })

}
 