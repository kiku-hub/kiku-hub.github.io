import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import React from 'react';

export const ContactEmail = ({
  type,
  company,
  name,
  nameKana,
  phone,
  email,
  message,
}) => {
  return (
    <Html>
      <Head />
      <Preview>ORCXウェブサイトからのお問い合わせ</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>お問い合わせを受け付けました</Heading>
          
          <Section style={section}>
            <Text style={labelText}>お問い合わせ種別:</Text>
            <Text style={contentText}>{type}</Text>
          </Section>

          <Section style={section}>
            <Text style={labelText}>会社名/組織名:</Text>
            <Text style={contentText}>{company}</Text>
          </Section>

          <Section style={section}>
            <Text style={labelText}>お名前:</Text>
            <Text style={contentText}>{name}</Text>
          </Section>

          <Section style={section}>
            <Text style={labelText}>フリガナ:</Text>
            <Text style={contentText}>{nameKana}</Text>
          </Section>

          <Section style={section}>
            <Text style={labelText}>電話番号:</Text>
            <Text style={contentText}>{phone}</Text>
          </Section>

          <Section style={section}>
            <Text style={labelText}>メールアドレス:</Text>
            <Text style={contentText}>{email}</Text>
          </Section>

          <Section style={section}>
            <Text style={labelText}>お問い合わせ内容:</Text>
            <Text style={contentText}>{message}</Text>
          </Section>

          <Text style={footer}>
            このメールはORCXウェブサイトのお問い合わせフォームから送信されました。
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center',
};

const section = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  marginBottom: '8px',
};

const labelText = {
  margin: '0 0 4px',
  color: '#666',
  fontSize: '14px',
};

const contentText = {
  margin: '0',
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center',
  margin: '48px 0 0',
};

export default ContactEmail;