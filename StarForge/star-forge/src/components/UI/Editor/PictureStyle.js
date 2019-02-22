const pictureStyles = theme => ({
    root: {
      position: 'relative',
      left: 0,
      top: 0,
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-around',
      overflow: 'auto',
      backgroundColor: theme.palette.background.paper,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        height: 200,
        width: '100%',
    },
    gridList: {
      boxSizing: 'border-box',
      display: 'block',
      justifyContent: 'space-between',
      textAlign: 'center',
      height: 200,
      width: '100%',
    },
    subheader: {
      width: '100%',
    },
    gridListTile: {
        display: 'inline-block',
        height: '100px',
        width: '100px',
        margin: '3px',
        padding: '3px',
        '&:hover': {
          border: 'solid 2px',
          borderColor: '#FFA500'
        },
    },
    gridListTileSelected: {
        display: 'inline-block',
        height: '100px',
        width: '100px',
        margin: '3px',
        padding: '3px',
        border: 'solid 2px',
        borderColor: '#FFA500',
    },
    image: {
        height: '100px',
        width: '100px'
    },
    lock: {
        opacity: '.4',
        '&:hover': {
            opacity: '.9'
        }
    }
  });

  export default pictureStyles;