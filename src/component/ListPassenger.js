import ListItem from './ListItem'
const ListPassenger = (props) => {
  return (
    <div>
      <table cellPadding="5px" cellSpacing="0" style={{ margin: 'auto' }}>
        <thead bgcolor="red">
          <tr>
            <th>Nama</th>
            <th>Umur</th>
            <th>Jenis Kelamin</th>
            <th bgcolor="white" className="removeBorder"></th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((item) => (
            <ListItem
              openEdit={props.openEdit}
              key={item.id}
              data={item}
              hapusPengunjung={props.hapusPengunjung}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListPassenger
