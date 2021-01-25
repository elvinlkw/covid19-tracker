const Footer = () => (
  <div className="text-center" style={style}>
    &copy; 2021 - Elvin Li Kam Wa
  </div>
)

const style = {
  position: 'absolute',
  left: 0,
  right: 0,
  backgroundColor: '#343a40',
  color: '#fff',
  padding: '2rem 0',
  zIndex: '10',
  width: '100vw'
}

export default Footer;