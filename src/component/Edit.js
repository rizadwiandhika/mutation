import React from 'react'

export default function Edit(props) {
  return (
    <div>
      <form>
        <div>
          <input
            onChange={props.onChangeInput}
            type="text"
            name="nama"
            value={props.nama}
          />
        </div>
        <div>
          <input
            onChange={props.onChangeInput}
            type="text"
            name="umur"
            value={props.umur}
          />
        </div>
        <div>
          <select
            value={props.jenisKelamin}
            onChange={props.onChangeInput}
            name="jenisKelamin"
          >
            <option value="Pria">Pria</option>
            <option value="Wanita">Wanit</option>
          </select>
        </div>
        <div>
          <button onClick={props.onSubmit}>Edit</button>
        </div>
      </form>
    </div>
  )
}
