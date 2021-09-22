import './Home.css'
const ListItem = (props) => {
  const { id, nama, umur, jenisKelamin } = props.data

  return (
    <tr>
      <td style={{ cursor: 'pointer' }} onClick={() => props.openEdit(id)}>
        {nama}
      </td>
      <td>{umur}</td>
      <td>{jenisKelamin}</td>
      <td className="removeBorder" onClick={() => props.hapusPengunjung(id)}>
        <button>Hapus</button>
      </td>
    </tr>
  )
}

export default ListItem
