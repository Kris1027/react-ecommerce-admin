import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ImageUpload } from './image-upload';

const createFile = (name: string, type: string, sizeKB: number): File => {
  const content = new ArrayBuffer(sizeKB * 1024);
  return new File([content], name, { type });
};

describe('ImageUpload', () => {
  it('should render upload area when value is empty', () => {
    render(<ImageUpload value={[]} onChange={vi.fn()} />);
    expect(screen.getByText('Click or drag to upload')).toBeInTheDocument();
  });

  it('should render preview when value contains a URL string', () => {
    render(
      <ImageUpload
        value={['https://example.com/image.jpg']}
        onChange={vi.fn()}
      />,
    );
    const img = screen.getByAltText('Upload preview');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(screen.getByText('Click or drag to upload')).toBeInTheDocument();
  });

  it('should call onChange with file appended on valid file selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ImageUpload value={[]} onChange={onChange} />);

    const file = createFile('photo.png', 'image/png', 100);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(input, file);

    expect(onChange).toHaveBeenCalledWith([file]);
  });

  it('should show error for invalid file type', () => {
    const onChange = vi.fn();
    render(<ImageUpload value={[]} onChange={onChange} accept='image/png' />);

    const file = createFile('photo.jpeg', 'image/jpeg', 100);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(input, 'files', { value: [file] });
    fireEvent.change(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText(/File type must be one of/)).toBeInTheDocument();
  });

  it('should show error for file exceeding max size', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ImageUpload value={[]} onChange={onChange} maxSizeMB={1} />);

    const file = createFile('large.png', 'image/png', 2048);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(input, file);

    expect(onChange).not.toHaveBeenCalled();
    expect(
      screen.getByText('File size must be less than 1MB'),
    ).toBeInTheDocument();
  });

  it('should remove item at index when remove button clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ImageUpload
        value={['https://example.com/image.jpg']}
        onChange={onChange}
        maxFiles={1}
      />,
    );

    const removeButton = screen.getByRole('button', {
      name: 'Remove image 1',
    });
    await user.click(removeButton);

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('should not show remove button when disabled', () => {
    render(
      <ImageUpload
        value={['https://example.com/image.jpg']}
        onChange={vi.fn()}
        maxFiles={1}
        disabled
      />,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should not show remove button for URLs when allowRemoveUrl is false', () => {
    render(
      <ImageUpload
        value={['https://example.com/image.jpg']}
        onChange={vi.fn()}
        maxFiles={1}
        allowRemoveUrl={false}
      />,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('should render multiple previews', () => {
    render(
      <ImageUpload
        value={['https://example.com/a.jpg', 'https://example.com/b.jpg']}
        onChange={vi.fn()}
      />,
    );
    const images = screen.getAllByAltText('Upload preview');
    expect(images).toHaveLength(2);
  });

  it('should remove individual item by index', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ImageUpload
        value={['https://example.com/a.jpg', 'https://example.com/b.jpg']}
        onChange={onChange}
      />,
    );

    const removeButtons = screen.getAllByRole('button');
    await user.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['https://example.com/b.jpg']);
  });

  it('should hide drop zone when maxFiles reached', () => {
    render(
      <ImageUpload
        value={['https://example.com/image.jpg']}
        onChange={vi.fn()}
        maxFiles={1}
      />,
    );
    expect(screen.queryByText('Click or drag to upload')).toBeNull();
  });

  it('should show drop zone when below maxFiles', () => {
    render(<ImageUpload value={[]} onChange={vi.fn()} maxFiles={2} />);
    expect(screen.getByText('Click or drag to upload')).toBeInTheDocument();
  });

  it('should append file to existing array', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ImageUpload
        value={['https://example.com/existing.jpg']}
        onChange={onChange}
      />,
    );

    const file = createFile('new.png', 'image/png', 100);
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    await user.upload(input, file);

    expect(onChange).toHaveBeenCalledWith([
      'https://example.com/existing.jpg',
      file,
    ]);
  });
});
