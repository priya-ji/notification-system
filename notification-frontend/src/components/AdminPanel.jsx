import { useState, useEffect } from 'react';
import { adminAPI, templateAPI, triggerAPI } from '../services/api';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [triggers, setTriggers] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [testRecipientInfo, setTestRecipientInfo] = useState({
    phone_number: '',
    email: '',
    user_id: 1,
  });

  const [formData, setFormData] = useState({
    trigger: '',
    channel: 'whatsapp',
    title: '',
    body: '',
    whatsapp_template_name: '',
  });

  useEffect(() => {
    loadTriggers();
  }, []);

  const loadTriggers = async () => {
    try {
      setLoading(true);
      const response = await triggerAPI.getAll();
      const triggersData = response.data;

      // Ensure triggers have all channels
      const enrichedTriggers = triggersData.map((trigger) => {
        const channels = {
          whatsapp: null,
          email: null,
          web_push: null,
        };

        trigger.templates.forEach((template) => {
          channels[template.channel] = template;
        });

        return {
          ...trigger,
          channels,
        };
      });

      setTriggers(enrichedTriggers);
    } catch (error) {
      setMessage(`Error loading triggers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        trigger: parseInt(formData.trigger),
        channel: formData.channel,
        title: formData.title,
        body: formData.body,
        is_enabled: true,
      };

      if (formData.channel === 'whatsapp') {
        payload.whatsapp_template_name = formData.whatsapp_template_name;
      }

      const response = await templateAPI.create(payload);
      setMessage('Template created successfully!');

      // Reset form
      setFormData({
        trigger: '',
        channel: 'whatsapp',
        title: '',
        body: '',
        whatsapp_template_name: '',
      });
      setShowTemplateForm(false);

      // Reload triggers
      loadTriggers();
    } catch (error) {
      setMessage(`Error creating template: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTemplate = async (templateId) => {
    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        body: formData.body,
      };

      if (formData.channel === 'whatsapp') {
        payload.whatsapp_template_name = formData.whatsapp_template_name;
      }

      await templateAPI.update(templateId, payload);
      setMessage('Template updated successfully!');
      setSelectedTemplate(null);
      setShowTemplateForm(false);
      loadTriggers();
    } catch (error) {
      setMessage(`Error updating template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTemplate = async (templateId) => {
    try {
      setLoading(true);
      await templateAPI.toggle(templateId);
      setMessage('Template toggled successfully!');
      loadTriggers();
    } catch (error) {
      setMessage(`Error toggling template: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSend = async (templateId) => {
    try {
      setLoading(true);
      const result = await templateAPI.testSend(templateId, testRecipientInfo);
      if (result.data.success) {
        setMessage(`✅ Test notification sent! (ID: ${result.data.log_id})`);
      } else {
        setMessage(`❌ Test failed: ${result.data.error}`);
      }
    } catch (error) {
      setMessage(`Error sending test: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClickTemplate = (template) => {
    setSelectedTemplate(template);
    setFormData({
      trigger: template.trigger,
      channel: template.channel,
      title: template.title,
      body: template.body,
      whatsapp_template_name: template.whatsapp_template_name || '',
    });
    setShowTemplateForm(true);
  };

  return (
    <div className="admin-panel">
      <h1>Notification Admin Panel</h1>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
          {message}
          <button onClick={() => setMessage('')}>×</button>
        </div>
      )}

      <div className="admin-controls">
        <button 
          onClick={() => {
            setShowTemplateForm(!showTemplateForm);
            setSelectedTemplate(null);
            setFormData({
              trigger: '',
              channel: 'whatsapp',
              title: '',
              body: '',
              whatsapp_template_name: '',
            });
          }}
          className="btn btn-primary"
        >
          {showTemplateForm ? 'Cancel' : '+ Create Template'}
        </button>

        <div className="test-recipient-info">
          <h3>Test Recipient Info</h3>
          <input
            type="text"
            placeholder="Phone Number (+1234567890)"
            value={testRecipientInfo.phone_number}
            onChange={(e) => setTestRecipientInfo({
              ...testRecipientInfo,
              phone_number: e.target.value
            })}
          />
          <input
            type="email"
            placeholder="Email"
            value={testRecipientInfo.email}
            onChange={(e) => setTestRecipientInfo({
              ...testRecipientInfo,
              email: e.target.value
            })}
          />
          <input
            type="number"
            placeholder="User ID"
            value={testRecipientInfo.user_id}
            onChange={(e) => setTestRecipientInfo({
              ...testRecipientInfo,
              user_id: parseInt(e.target.value)
            })}
          />
        </div>
      </div>

      {showTemplateForm && (
        <div className="form-container">
          <h2>{selectedTemplate ? 'Edit Template' : 'Create New Template'}</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (selectedTemplate) {
              handleEditTemplate(selectedTemplate.id);
            } else {
              handleCreateTemplate(e);
            }
          }}>
            {!selectedTemplate && (
              <>
                <div className="form-group">
                  <label>Trigger *</label>
                  <select
                    value={formData.trigger}
                    onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
                    required
                  >
                    <option value="">Select Trigger</option>
                    {triggers.map((trigger) => (
                      <option key={trigger.id} value={trigger.id}>
                        {trigger.name_display}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Channel *</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    required
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                    <option value="web_push">Web Push</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Title / Subject *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Email subject or Web Push title"
                required
              />
            </div>

            <div className="form-group">
              <label>Message Body *</label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                placeholder="The message content"
                required
                rows="4"
              />
            </div>

            {formData.channel === 'whatsapp' && (
              <div className="form-group">
                <label>WhatsApp Template Name</label>
                <input
                  type="text"
                  value={formData.whatsapp_template_name}
                  onChange={(e) => setFormData({ ...formData, whatsapp_template_name: e.target.value })}
                  placeholder="e.g., hello_world"
                />
              </div>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (selectedTemplate ? 'Update Template' : 'Create Template')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="triggers-table">
        <h2>Notification Triggers & Templates</h2>
        {loading && <p>Loading...</p>}

        {triggers.length === 0 ? (
          <p>No triggers found. Create some first!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Trigger</th>
                <th>WhatsApp</th>
                <th>Email</th>
                <th>Web Push</th>
              </tr>
            </thead>
            <tbody>
              {triggers.map((trigger) => (
                <tr key={trigger.id}>
                  <td className="trigger-name">{trigger.name_display}</td>

                  {['whatsapp', 'email', 'web_push'].map((channel) => (
                    <td key={channel} className="channel-cell">
                      {trigger.channels[channel] ? (
                        <div className="template-actions">
                          <div className="template-info">
                            <span className="status" style={{
                              backgroundColor: trigger.channels[channel].is_enabled ? '#4CAF50' : '#999'
                            }}>
                              {trigger.channels[channel].is_enabled ? '●' : '○'}
                            </span>
                            <span className="template-text">
                              {trigger.channels[channel].body.substring(0, 20)}...
                            </span>
                          </div>
                          <div className="template-buttons">
                            <button
                              onClick={() => handleClickTemplate(trigger.channels[channel])}
                              className="btn btn-sm btn-edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleTemplate(trigger.channels[channel].id)}
                              className={`btn btn-sm ${trigger.channels[channel].is_enabled ? 'btn-disable' : 'btn-enable'}`}
                            >
                              {trigger.channels[channel].is_enabled ? 'Off' : 'On'}
                            </button>
                            <button
                              onClick={() => handleTestSend(trigger.channels[channel].id)}
                              className="btn btn-sm btn-test"
                            >
                              Test
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setFormData({
                              trigger: trigger.id,
                              channel: channel,
                              title: '',
                              body: '',
                              whatsapp_template_name: '',
                            });
                            setSelectedTemplate(null);
                            setShowTemplateForm(true);
                          }}
                          className="btn btn-sm btn-add"
                        >
                          + Add
                        </button>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
