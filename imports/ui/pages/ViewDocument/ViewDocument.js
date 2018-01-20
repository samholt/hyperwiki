import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Documents from '../../../api/Documents/Documents';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

// import Markdown from 'react-markdown-it';

var md = require('markdown-it')({
  html: true,
  linkify: true,
  typographer: true
});

const handleRemove = (documentId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', documentId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        history.push('/documents');
      }
    });
  }
};

// const renderDocument = (doc, match, history) => (doc ? (
//   <div className="ViewDocument">
//     <div className="page-header clearfix">
//       <h4 className="pull-left">{ doc && doc.title }</h4>
//       <ButtonToolbar className="pull-right">
//         <ButtonGroup bsSize="small">
//           <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
//           <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
//             Delete
//           </Button>
//         </ButtonGroup>
//       </ButtonToolbar>
//     </div>
//     { doc && doc.body }
//   </div>
// ) : <NotFound />);

class RenderDocument extends React.Component {
  componentDidMount() {
    this.body.innerHTML = md.render(this.props.doc.body);
  }
render () {
  const {doc,match,history} = this.props;
  return (doc ? (
  <div className="ViewDocument">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      <div ref={body => (this.body = body)}></div>
    </div>
  </div>
) : <NotFound />);
}
}
// <Markdown source={this.props.doc.body} />

// const ViewDocument = ({
//   loading, doc, match, history,
// }) => (
//   !loading ? renderDocument(doc, match, history) : <Loading />
// );

const ViewDocument = ({
  loading, doc, match, history,
}) => (
  !loading ? <RenderDocument doc={doc} match={match} history={history}/> : <Loading />
);

ViewDocument.defaultProps = {
  doc: null,
};

ViewDocument.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  return {
    loading: !subscription.ready(),
    doc: Documents.findOne(documentId),
  };
})(ViewDocument);
