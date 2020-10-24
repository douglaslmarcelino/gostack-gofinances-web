import React, { useState } from 'react';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import {
  Container,
  Title,
  ImportFileContainer,
  Footer,
  FeedbackMessage,
} from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

interface FeedbackProps {
  type: string;
  message: string;
}

const Import: React.FC = () => {
  const [feedbackMessage, setFeedbackMessage] = useState<FeedbackProps | null>(
    null,
  );
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);

  function clearFeedbackMessage(): void {
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 1000);
  }

  function showFeedbackMessage(type: string, message: string): void {
    setFeedbackMessage({
      type,
      message,
    });

    clearFeedbackMessage();
  }

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    uploadedFiles.map(file => {
      return data.append('file', file.file);
    });

    try {
      await api.post('/transactions/import', data);

      showFeedbackMessage('success', 'Arquivo importado com sucesso!');
      setUploadedFiles([]);
    } catch {
      showFeedbackMessage(
        'error',
        'Erro ao importar arquivo, por favor, tente novamente.',
      );
    }
  }

  function submitFile(files: File[]): void {
    const uploadedFile = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(uploadedFile);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>

          {feedbackMessage && (
            <FeedbackMessage className={feedbackMessage.type}>
              {feedbackMessage.message}
            </FeedbackMessage>
          )}
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
