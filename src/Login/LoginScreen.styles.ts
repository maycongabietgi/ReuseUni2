import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 3,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'flex-end',
  },
  progressFill: {
    height: 3,
    width: '50%',
    backgroundColor: '#4A7DFF',
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  button: {
    borderWidth: 1,
    borderColor: '#4A7DFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#4A7DFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
